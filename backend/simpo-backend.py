import os
import subprocess
from datetime import datetime
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

QUEUE_DIR = 'queue'
PERMIT_FILE = 'permit.txt'

class QueueHandler(FileSystemEventHandler):
    def process(self, event):
        """
        Process the queued file when it's added.
        """
        if event.event_type == 'created':
            with open(event.src_path, 'r') as file:
                user_details = file.read().strip()
                ip_address = user_details.split(',')[0]  # Assuming IP is the first detail in the file
                mac_address = self.get_mac_address(ip_address)
                if mac_address:
                    self.add_to_permit(mac_address)
                    self.log_processed_details(user_details)
            os.remove(event.src_path)

    def get_mac_address(self, ip):
        """
        Get MAC address for a given IP using ARP.
        """
        try:
            cmd = f"arp -n {ip} | awk '{{print $3}}'"
            mac_address = subprocess.check_output(cmd, shell=True).decode('utf-8').strip()
            return mac_address
        except Exception as e:
            print(f"Error getting MAC address for IP {ip}: {e}")
            return None

    def add_to_permit(self, mac):
        """
        Add the MAC address to the permit file.
        """
        with open(PERMIT_FILE, 'a') as file:
            file.write(mac + '\n')
            print(f"Added MAC address {mac} to permit file.")

    def log_processed_details(self, details):
        """
        Log processed user details to a file named by the year, month, and day.
        """
        date_str = datetime.now().strftime('%Y_%m_%d')
        log_file = f"{date_str}.log"
        with open(log_file, 'a') as file:
            file.write(details + '\n')
            print(f"Logged details to {log_file}.")


    def on_created(self, event):
        self.process(event)

if __name__ == "__main__":
    event_handler = QueueHandler()
    observer = Observer()
    observer.schedule(event_handler, QUEUE_DIR, recursive=False)
    observer.start()

    try:
        while True:
            pass
    except KeyboardInterrupt:
        observer.stop()

    observer.join()
