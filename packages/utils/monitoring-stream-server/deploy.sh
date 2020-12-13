docker build -t frikanalen/monitoring-stream-ws . && docker push frikanalen/monitoring-stream-ws && kubectl rollout restart deployment monitoring-stream-ws
