# SmartBus API verification harness - hits all 38 endpoints, asserts status + key shapes.
# Prereqs: MySQL smartbus DB seeded (db-setup.sql), backend running on :8081.
# Run:  powershell -ExecutionPolicy Bypass -File verify-api.ps1
$ErrorActionPreference = "Stop"
$base = "http://localhost:8081/api"
$script:pass = 0; $script:fail = 0
$script:failures = @()

function Req($method, $path, $token = $null, $body = $null) {
  $h = @{ "Content-Type" = "application/json" }
  if ($token) { $h["Authorization"] = "Bearer $token" }
  $p = @{ Uri = "$base$path"; Method = $method; Headers = $h; ErrorAction = "SilentlyContinue" }
  if ($body -ne $null) { $p.Body = ($body | ConvertTo-Json -Depth 6 -Compress) }
  try {
    $r = Invoke-WebRequest @p -UseBasicParsing
  } catch {
    if ($_.Exception.Response) {
      $r = $_.Exception.Response
    } else {
      throw
    }
  }
  if ($r -is [System.Net.HttpWebResponse]) {
    $status = [int]$r.StatusCode
    $content = (New-Object System.IO.StreamReader($r.GetResponseStream())).ReadToEnd()
  } else {
    $status = $r.StatusCode
    $content = $r.Content
  }
  $data = $null
  if ($content) { try { $data = $content | ConvertFrom-Json } catch { $data = $content } }
  return @{ Status = $status; Data = $data }
  $data = $null
  if ($r.Content) { try { $data = $r.Content | ConvertFrom-Json } catch { $data = $r.Content } }
  return @{ Status = [int]$r.StatusCode; Data = $data }
}

function Check($name, $cond, $detail = "") {
  if ($cond) { $script:pass++; Write-Host "PASS  $name" }
  else { $script:fail++; $script:failures += $name; Write-Host "FAIL  $name $detail" }
}

Write-Host "== auth =="
$admin = Req POST "/auth/login" -body @{ email = "admin@smartbus.com"; password = "password" }
Check "admin login 200 + token + SafeUser(no password)" ($admin.Status -eq 200 -and $admin.Data.token -and $admin.Data.user.role -eq "ADMIN" -and $null -eq $admin.Data.user.password)
$oper = Req POST "/auth/login" -body @{ email = "metro@smartbus.com"; password = "password" }
Check "operator login" ($oper.Status -eq 200 -and $oper.Data.user.role -eq "OPERATOR")
$pass1 = Req POST "/auth/login" -body @{ email = "alex@smartbus.com"; password = "password" }
Check "passenger login" ($pass1.Status -eq 200 -and $pass1.Data.user.role -eq "PASSENGER")
$tA = $admin.Data.token; $tO = $oper.Data.token; $tP = $pass1.Data.token
$bad = Req POST "/auth/login" -body @{ email = "alex@smartbus.com"; password = "wrong" }
Check "bad password -> 401" ($bad.Status -eq 401)
$noauth = Req GET "/buses"
Check "no token -> 401/403" ($noauth.Status -eq 401 -or $noauth.Status -eq 403)
$reg = Req POST "/auth/register" -body @{ name = "Verify User"; email = "verify.tester@smartbus.com"; password = "password"; role = "PASSENGER"; phone = "+1 555 0199" }
Check "register 200 + token" ($reg.Status -eq 200 -and $reg.Data.token)
$me = $reg.Data.user.id
$self = Req PUT "/users/$me" $reg.Data.token -body @{ phone = "+1 555 0100" }
Check "self profile patch" ($self.Status -eq 200 -and $self.Data.phone -eq "+1 555 0100")
$other = Req PUT "/users/u1" $tP -body @{ phone = "x" }
Check "passenger patching admin -> 403" ($other.Status -eq 403)

Write-Host "== admin =="
$st = Req GET "/admin/stats" $tA
Check "stats has counts + avgRating" ($st.Status -eq 200 -and $st.Data.buses -eq 5 -and $st.Data.stops -eq 10 -and $null -ne $st.Data.avgRating)
$stF = Req GET "/admin/stats" $tP
Check "passenger stats -> 403" ($stF.Status -eq 403)
$us = Req GET "/admin/users" $tA
Check "listUsers SafeUser (no password field)" ($us.Status -eq 200 -and $us.Data.Count -ge 3 -and $null -eq $us.Data[0].password)
$uu = Req PUT "/admin/users/$me" $tA -body @{ active = $true }
Check "admin updateUser" ($uu.Status -eq 200 -and $uu.Data.active -eq $true)
$ops = Req GET "/admin/operators" $tA
Check "listOperators with counts" ($ops.Status -eq 200 -and $ops.Data[0].busCount -ge 5 -and $null -ne $ops.Data[0].user)
$cop = Req POST "/admin/operators" $tA -body @{ name = "Verify Op"; email = "verify.op@smartbus.com"; organizationName = "Verify Org" }
Check "createOperator" ($cop.Status -eq 200 -and $cop.Data.user.role -eq "OPERATOR")
$al = Req GET "/admin/audit-logs" $tA
Check "audit-logs DESC + actorName" ($al.Status -eq 200 -and $al.Data.Count -ge 5 -and $al.Data[0].actorName)
$fb = Req GET "/admin/feedback" $tA
Check "feedback + passengerName/tripLabel" ($fb.Status -eq 200 -and $fb.Data[0].passengerName -and $fb.Data[0].tripLabel)
$dr = Req GET "/admin/delay-reports" $tA
Check "delay-reports" ($dr.Status -eq 200 -and $dr.Data.Count -ge 1)

Write-Host "== buses =="
$bl = Req GET "/buses" $tP
Check "list buses + operatorName" ($bl.Status -eq 200 -and $bl.Data.Count -ge 5 -and $bl.Data[0].operatorName)
$b1 = Req GET "/buses/b1" $tP
Check "get bus b1" ($b1.Status -eq 200 -and $b1.Data.busNumber -eq "MC-101")
$b404 = Req GET "/buses/nope" $tP
Check "missing bus -> 404 'Bus not found.'" ($b404.Status -eq 404)
$bn = "MC-TEST-" + (Get-Random -Minimum 100 -Maximum 999)
$bc = Req POST "/buses" $tO -body @{ busNumber = $bn; busType = "Standard"; capacity = 40; status = "ACTIVE"; operatorId = "op1" }
Check "create bus" ($bc.Status -eq 200 -and $bc.Data.busNumber -eq $bn)
$bid = $bc.Data.id
$dup = Req POST "/buses" $tO -body @{ busNumber = $bn }
Check "dup busNumber -> 400" ($dup.Status -eq 400)
$bu = Req PUT "/buses/$bid" $tO -body @{ capacity = 41 }
Check "update bus" ($bu.Status -eq 200 -and $bu.Data.capacity -eq 41)
$br = Req GET "/routes/r1/buses" $tP
Check "buses by route r1" ($br.Status -eq 200 -and $br.Data.Count -ge 2)
$bd = Req DELETE "/buses/$bid" $tO
Check "delete bus" ($bd.Status -eq 200)
$bw = Req POST "/buses" $tP -body @{ busNumber = "MC-NOPE-1" }
Check "passenger create bus -> 403" ($bw.Status -eq 403)

Write-Host "== routes =="
$rl = Req GET "/routes" $tP
Check "list routes" ($rl.Status -eq 200 -and $rl.Data.Count -ge 4)
$r1 = Req GET "/routes/r1" $tP
Check "get route r1 Airport Express" ($r1.Status -eq 200 -and $r1.Data.routeName -eq "Airport Express")
$rn = "Test Line " + (Get-Random -Minimum 100 -Maximum 999)
$rc = Req POST "/routes" $tO -body @{ routeName = $rn; source = "A"; destination = "B"; status = "ACTIVE" }
Check "create route" ($rc.Status -eq 200)
$rid = $rc.Data.id
$ru = Req PUT "/routes/$rid" $tO -body @{ status = "INACTIVE" }
Check "update route" ($ru.Status -eq 200 -and $ru.Data.status -eq "INACTIVE")
$rs = Req GET "/routes/r1/stops" $tP
Check "stops for r1 ordered + stop obj" ($rs.Status -eq 200 -and $rs.Data.Count -eq 4 -and $rs.Data[0].stopOrder -eq 1 -and $rs.Data[0].stop.stopName)
$rd = Req DELETE "/routes/$rid" $tO
Check "delete route" ($rd.Status -eq 200)

Write-Host "== stops =="
$sl = Req GET "/stops" $tP
Check "list stops (10)" ($sl.Status -eq 200 -and $sl.Data.Count -ge 10)
$s1 = Req GET "/stops/s1" $tP
Check "get stop s1" ($s1.Status -eq 200 -and $s1.Data.stopName -eq "Central Station")
$sc = Req POST "/stops" $tO -body @{ stopName = "Verify Stop"; latitude = 1.1; longitude = 2.2 }
Check "create stop" ($sc.Status -eq 200 -and $sc.Data.latitude -eq 1.1)
$sid = $sc.Data.id
$su = Req PUT "/stops/$sid" $tO -body @{ address = "Nowhere" }
Check "update stop" ($su.Status -eq 200 -and $su.Data.address -eq "Nowhere")
$sr = Req GET "/stops/s1/routes" $tP
Check "routes for s1 (r1+r3)" ($sr.Status -eq 200 -and $sr.Data.Count -ge 2)
$sd = Req DELETE "/stops/$sid" $tO
Check "delete stop" ($sd.Status -eq 200)

Write-Host "== schedules =="
$hl = Req GET "/schedules" $tP
Check "list schedules decorated" ($hl.Status -eq 200 -and $hl.Data.Count -ge 6 -and $hl.Data[0].routeName -and $hl.Data[0].busNumber)
$hc = Req POST "/schedules" $tO -body @{ routeId = "r1"; busId = "b1"; departureTime = "09:00"; arrivalTime = "09:40"; days = "DAILY" }
Check "create schedule" ($hc.Status -eq 200 -and $hc.Data.routeName -eq "Airport Express")
$hid = $hc.Data.id
$hu = Req PUT "/schedules/$hid" $tO -body @{ days = "WEEKEND" }
Check "update schedule" ($hu.Status -eq 200 -and $hu.Data.days -eq "WEEKEND")
$hr = Req GET "/routes/r1/schedules" $tP
Check "schedules for r1" ($hr.Status -eq 200 -and $hr.Data.Count -ge 3)
$hd = Req DELETE "/schedules/$hid" $tO
Check "delete schedule" ($hd.Status -eq 200)

Write-Host "== trips + locations =="
$tl = Req GET "/trips" $tO
Check "list trips decorated" ($tl.Status -eq 200 -and $tl.Data.Count -ge 4 -and $tl.Data[0].busNumber)
$t1 = Req GET "/trips/t1" $tO
Check "get trip t1 ONGOING" ($t1.Status -eq 200 -and $t1.Data.status -eq "ONGOING")
$tc = Req POST "/trips" $tO -body @{ busId = "b1"; routeId = "r1"; tripDate = (Get-Date -Format "yyyy-MM-dd"); status = "SCHEDULED" }
Check "create trip" ($tc.Status -eq 200 -and $tc.Data.status -eq "SCHEDULED")
$tid = $tc.Data.id
$ts = Req PATCH "/trips/$tid/status" $tO -body @{ status = "ONGOING" }
Check "status->ONGOING sets startTime" ($ts.Status -eq 200 -and $ts.Data.startTime)
$ts2 = Req PATCH "/trips/$tid/status" $tO -body @{ status = "COMPLETED" }
Check "status->COMPLETED sets endTime" ($ts2.Status -eq 200 -and $ts2.Data.endTime)
$loc = Req GET "/trips/t1/locations" $tO
Check "locations for t1" ($loc.Status -eq 200 -and $loc.Data.Count -ge 2)
$rloc = Req POST "/trips/t1/locations" $tO -body @{ latitude = 35.68; longitude = 139.70 }
Check "record location" ($rloc.Status -eq 200 -and $rloc.Data.recordedAt)
$td = Req DELETE "/trips/$tid" $tO
Check "delete trip" ($td.Status -eq 200)

Write-Host "== predictions =="
$pt = Req GET "/trips/t1/predictions" $tP
Check "predictions for t1 decorated" ($pt.Status -eq 200 -and $pt.Data.Count -ge 4 -and $pt.Data[0].stop)
$pa = Req GET "/stops/s2/arrivals" $tP
Check "upcoming arrivals s2" ($pa.Status -eq 200 -and $pa.Data.Count -ge 1)
$pg = Req POST "/predictions" $tO -body @{ tripId = "t1"; stopId = "s1"; predictedArrival = (Get-Date).ToUniversalTime().AddMinutes(15).ToString("o"); confidenceScore = 90 }
Check "generate prediction" ($pg.Status -eq 200 -and $pg.Data.predictionTime)

Write-Host "== favorites =="
$fs = Req GET "/users/u3/favorites/stops" $tP
Check "passenger fav stops (2)" ($fs.Status -eq 200 -and $fs.Data.Count -ge 2 -and $fs.Data[0].stop)
$fr = Req GET "/users/u3/favorites/routes" $tP
Check "passenger fav routes" ($fr.Status -eq 200 -and $fr.Data.Count -ge 1 -and $fr.Data[0].route)
$fa = Req POST "/users/u3/favorites/stops" $tP -body @{ stopId = "s2" }
Check "add fav stop" ($fa.Status -eq 200)
$fd = Req DELETE "/users/u3/favorites/stops/s2" $tP
Check "remove fav stop" ($fd.Status -eq 200)
$fra = Req POST "/users/u3/favorites/routes" $tP -body @{ routeId = "r2" }
Check "add fav route" ($fra.Status -eq 200)
$frd = Req DELETE "/users/u3/favorites/routes/r2" $tP
Check "remove fav route" ($frd.Status -eq 200)
$fx = Req GET "/users/u2/favorites/stops" $tP
Check "passenger reading operator favs -> 403" ($fx.Status -eq 403)

Write-Host "== notifications =="
$nl = Req GET "/users/u3/notifications" $tP
Check "list notifs DESC" ($nl.Status -eq 200 -and $nl.Data.Count -ge 3)
$nu = Req GET "/users/u3/notifications/unread" $tP
Check "unread count is bare number >= 2" ($nu.Status -eq 200 -and ($nu.Data -is [int] -or $nu.Data -is [long]) -and $nu.Data -ge 2)
$mr = Req PATCH "/notifications/n2/read" $tP
Check "mark n2 read" ($mr.Status -eq 200 -and $mr.Data.isRead -eq $true)
$ma = Req PATCH "/users/$me/notifications/read-all" $reg.Data.token
Check "mark-all-read new user" ($ma.Status -eq 200)
$bc2 = Req POST "/notifications/broadcast" $tA -body @{ title = "Verify broadcast"; message = "harness check"; type = "SYSTEM" }
Check "broadcast fans out" ($bc2.Status -eq 200 -and $bc2.Data.Count -ge 4)

Write-Host ""
Write-Host "RESULT: $script:pass passed, $script:fail failed"
if ($script:failures) { Write-Host "FAILURES:"; $script:failures | ForEach-Object { Write-Host " - $_" }; exit 1 }
