import random
import time
from pycaw.pycaw import AudioUtilities

device = AudioUtilities.GetSpeakers()
volume = device.EndpointVolume

print("Starting random volume changes (Ctrl+C to stop)")
print("Range: 15% - 100% | Intervals: 1 - 30 seconds\n")

try:
    while True:
        level = random.randint(60, 100)
        wait = random.uniform(1, 15)

        volume.SetMasterVolumeLevelScalar(level / 100.0, None)
        print(f"Volume -> {level:3d}% | next change in {wait:.1f}s")

        time.sleep(wait)
except KeyboardInterrupt:
    print("\nStopped.")
