## Monitoring of switches

Until we get fksw1 online, only fksw2 is monitored.

Junos configuration:

```
    login {
        user junos_exporter {
            uid 1337;
            class read-only;
            authentication {
                ssh-rsa "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDa16/bpm7QLtsjaGfSIwyMaD9ArJvjWjfijrf+uGtgB5KpugkUFUoaEqcKsdU+mLAMi/CWG/U3toA19jSwT62gf3mIfayyvNss34YylUUKUtfrOS/iRNB3KnfYyxr2g4e0xbmpI60C3LUmATNZUBhl86KtrjH96+i3G+8NOmFcO1dzxix74mNOQKWtBI8PscD/4EtJWL3h4sYJnDAwqMeiMhKkv0mAhx0B01+vrOG40/oP4R5OtkVaG0bDErEFxGPB1tcpjJLCs6/27sOQgS/2ecybgAFqiE65klLAO4jhSP9iz4mNr82/9eBLFoLWIdvT8EJM8TnpgmhGrR01t6H8hbjnj6AwhVzW3TV2TVXeAP0Wxkx2ttMYwRFXBgSk+QD/0La5om1ZzQWEYGH30VOHukKG8ejTWl5KIYpCyPalvMCfIvVRV98lLt9tT3NjFDR/PYBp4ZGM5b2JEefCJqndsPTlGTnhrtbuqVINO8PEx+ydj+Q7O2+AXsMiCdJACW8= toresbe@simula"; ## SECRET-DATA
            }
        }
    }
```
