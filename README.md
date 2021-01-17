# Running-Jobs
Running tower/awx jobs on clusters/hosts.

# Deploy
```
kubectl apply -f k8s_objects/job-runner-deployment.yaml
kubectl apply -f k8s_objects/job-runner-svc.yaml
kubectl expose deployment job-runner-deployment --type=LoadBalancer --name=job-runner-svc -n dba-jobrunner
```
