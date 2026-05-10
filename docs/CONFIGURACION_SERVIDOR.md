# 🛠️ Configuración de la Infraestructura del Servidor

Este documento detalla las especificaciones técnicas, las decisiones de hardware y los pasos de configuración realizados para establecer el servidor base del proyecto sobre una Raspberry Pi 5.

## 1. Especificaciones de Hardware y Justificación

Para garantizar la disponibilidad 24/7 y un rendimiento óptimo de la base de datos PostgreSQL, se ha seleccionado la siguiente configuración:

* **Host:** Raspberry Pi 5 (8GB RAM).
    * *Justificación:* La arquitectura de 64 bits y los 8GB de RAM permiten manejar múltiples contenedores Docker (Backend, Frontend, DB) con un margen de seguridad del 70% de recursos libres.
* **Almacenamiento Principal:** SSD NVMe (512GB).
    * *Justificación:* Se ha descartado el uso de tarjetas microSD debido a su alta tasa de fallo por ciclos de escritura de la base de datos. El SSD ofrece velocidades de ~800 MB/s (limitadas por el bus PCIe de la Pi) y mayor durabilidad (TBW).
* **Interfaz de Almacenamiento:** PCIe M.2 NVMe SSD-Adapter-Board.
* **Infraestructura:** Carcasa metálica robusta con refrigeración activa.
* **Alimentación:** Fuente de alimentación oficial Raspberry Pi 27W USB-C PD.
    * *Justificación:* Imprescindible para suministrar los 5A necesarios para alimentar el disco NVMe bajo carga.

## 2. Preparación y Optimización del SSD

Antes de la instalación, se procede a realizar un borrado físico y optimización de las celdas del SSD para asegurar el máximo rendimiento de escritura:

```bash
# Identificación del dispositivo
lsblk

# Eliminación de firmas de tablas de particiones previas (GPT/MBR)
sudo wipefs -a /dev/nvme0n1

# Borrado físico y envío de señal TRIM (liberación de celdas)
sudo blkdiscard -v /dev/nvme0n1
```

## 3. Migración del Sistema (SD a SSD)
Para evitar la reconfiguración manual del sistema operativo, se realiza una clonación en caliente utilizando la herramienta rpi-clone.

**Pasos realizados:**
### 1. Realización de la clonación:
```bash
sudo dd if=/dev/mmcblk0 of=/dev/nvme0n1 bs=1M status=progress conv=fsync
```
- **if:** Origen (SD)
- **of:** Destino (SSD)
- **conv=fsync:** Asegura que el búfer se vacíe físicamente en el disco.

### 2. Apagado de seguridad:
```bash
sudo poweroff
```

### 3. Cambio físico:
- Desconecta la alimentación.
- Saca la tarjeta microSD de la Raspberry Pi. Ahora el SSD es un clon exacto, tiene el mismo ID de disco y si dejas ambos, el sistema podría confundirse al arrancar.

### 4. Primer arranque desde el SSD:
- Conecta la alimentación. La Pi 5 verá que no hay SD y arrancará desde el NVMe. El primer arranque puede tardar unos segundos más.

### 5. Después de arrancar, hay que recuperar los 512GB
- Cuando entras por SSH de nuevo, si haces lsblk verás que tu partición sigue pareciendo de 64GB o e tamaño de tu tarjeta SD, ya que hemos clonado el tamaño de la SD. Vamos a expandirla para usar todo el SSD.
    #### 5.1. Abre la configuración:
    ```bash
    sudo raspi-config
    ```
    #### 5.2. Ve a 6 Advanced Options.
    #### 5.3. Selecciona A1 Expand Filesystem.
    #### 5.4. Dale a Ok, luego a Finish y acepta Reiniciar.

## 4. Configuración Inicial del Sistema

### 1. Actualización completa:
```bash
sudo apt update && sudo apt full-upgrade -y
```

### 2. Configuración de Red:
Reserva desde tu RT la IP estática vía DHCP para asegurar la persistencia de la URL del servidor en la red local.

## 5. Entorno de Contenedores (Docker)
El servidor utiliza Docker para la orquestación de servicios, garantizando que el entorno de desarrollo sea idéntico al de producción.

```bash
# Instalación de Docker mediante script oficial
curl -sSL https://get.docker.com | sh

# Gestión de permisos para el usuario actual
sudo usermod -aG docker $USER
```
