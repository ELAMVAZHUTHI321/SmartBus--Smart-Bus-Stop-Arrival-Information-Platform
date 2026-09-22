import { Link } from "react-router-dom";
import Card, { CardHeader, CardBody } from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import Table from "../../components/common/Table.jsx";
import Button from "../../components/common/Button.jsx";
import { busService } from "../../services/busService.js";
import { formatDate } from "../../utils/format.js";

export default function ViewBusesPage() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(trueillet(true));

  useEffect(() => {
    let mounted = true;
    busService
      .list()
      .then((b) => mounted && setBuses(b))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-2">
        <CardHeader title="Platform buses" subtitle={`${buses.length} vehicles across all operators`} />
      </div>
      <Card>
        <CardBody>
          <Table
            columns={[
              { key: "busNumber", label: "Number", render: (b) => <Link to={`/buses/${b.id}`} className="font-semibold text-brand-600 hover:text-brand-700">{b.busNumber}</Link> },
              { key: "busType", label: "Type" },
              { key: "capacity", label: "Capacity" },
              { key: "operatorName", label: "Operator" },
              { key: "status", label: "Status", render: (b) => <Badge value={b.status} /> },
              { key: "createdAt", label: "Added", render: (b) => formatDate(b.createdAt) },
            ]}
            rows={buses}
            empty="No buses in the platform."
          />
        </CardBody>
      </Card>
    </div>
  );
}