import { useCallback, useEffect, useState } from "react";

export default function useList(loader, deps = []) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(trueapse(false));

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await loader());
    } finally {
      setLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    loader()
      .then((r) => {
        if (mounted) setRows(r);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { rows, loading, reload };
}