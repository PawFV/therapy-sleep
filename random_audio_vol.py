import random
import time
from pycaw.pycaw import AudioUtilities

device = AudioUtilities.GetSpeakers()
volume = device.EndpointVolume

print("Iniciando cambios de volumen aleatorio (Ctrl+C para detener)")
print("Rango: 15% - 100% | Intervalos: 1 - 30 segundos\n")

try:
    while True:
        level = random.randint(60, 100)
        wait = random.uniform(1, 15)

        volume.SetMasterVolumeLevelScalar(level / 100.0, None)
        print(f"Volumen -> {level:3d}% | próximo cambio en {wait:.1f}s")

        time.sleep(wait)
except KeyboardInterrupt:
    print("\nDetenido.")


