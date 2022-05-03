# Add the RaspWhere Ping
echo "Add the RaspWhere Ping Script"

cat <<'SCRIPT_EOT' >> /etc/init.d/rw-ping.sh
#!/bin/bash

### BEGIN INIT INFO
# Provides:          rw-ping.sh
# Required-Start:    $local_fs $network $remote_fs $syslog
# Required-Stop:     $local_fs
# Default-Start:     3 6
# Default-Stop:
# Short-Description: RaspWhere Pinging Service
# Description:       RaspWhere Pinging Service
### END INIT INFO

curl -d "ip=$(hostname -I)&hostname=$(hostname)&fqdn=$(hostname -f)" http://192.168.1.115:2222/api/ping/A4719C-QW7JK0/

exit 0

SCRIPT_EOT
chmod 755 /etc/init.d/rw-ping.sh
update-rc.d rw-ping.sh defaults
