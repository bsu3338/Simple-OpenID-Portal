# Simple OpenID Portal (simpo)

## Project goal
The goal of the project is to create a simple network authentication portal for network devices.  The system only provides basic autentication without any adminisrtator interface.

## Web Frontend


## Backend

## Host

### Install prerequisites
```
apk add nano iptables ip6tables dnsmasq
rc-update add dnsmasq
rc-service dnsmasq start
rc-update add iptables
rc-service iptables save
rc-service iptables start
```

### Create a file /etc/sysctl.d/local.conf
```
# Uncomment the next line to enable packet forwarding for IPv4
net.ipv4.ip_forward=1

# Uncomment the next line to enable packet forwarding for IPv6
#  Enabling this option disables Stateless Address Autoconfiguration
#  based on Router Advertisements for this host
net.ipv6.conf.all.forwarding=1

#Give priroity to shorter connections
net.core.default_qdisc = fq_codel

#Allow async network flows
net.ipv4.conf.default.rp_filter = 0
net.ipv4.conf.all.rp_filter=0
net.ipv4.conf.all.log_martians=1

#Increase Max Number of Connections
net.netfilter.nf_conntrack_max=524288
```

