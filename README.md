# Running-Jobs
Running tower/awx jobs on clusters/hosts.

# Deploy


Create configmap and secrets:
```
kubectl create secret generic tower-cred --from-literal=username=admin --from-literal=password=password
```

Create deployment and service:
```
kubectl apply -f k8s_objects/job-runner-deployment.yaml
kubectl apply -f k8s_objects/job-runner-svc.yaml
kubectl expose deployment job-runner --type=LoadBalancer --name=job-runner-svc -n dba-jobrunner
```
