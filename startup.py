from subprocess import call
import threading 


def Program0():
  subprocess.call(["node", "./.."])

def Program1():
  subprocess.call(["python", "./.."])


t1 = threading.Thread(target=Program0) 
t2 = threading.Thread(target=Program1)

# starting thread 1 
t1.start() 
# starting thread 2 
t2.start() 
