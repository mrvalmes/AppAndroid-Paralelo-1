<template>
    <Page>
        <ActionBar title="Facturacion" />
        <ScrollView>
            <!-- Stack principal o varios stacks, pero sin etiqueta huérfana -->
            <StackLayout class="p-20">
                <!-- Título -->
                <Label text="Crear Factura" class="h2 mb-10" />

                <!-- Nombre del cliente -->
                <TextField v-model="cliente" hint="Nombre del cliente" class="mb-15" />

                <!-- DropDown para smartphones -->
                <Label text="Selecciona el smartphone" class="mt-10 mb-5" />
                <DropDown
                    ref="dropDownList"
                    :items="smartphonesNames"
                    v-model="selectedIndex"
                    hint="Selecciona un Equipo"
                    @selectedIndexChanged="dropDownSelectedIndexChanged"
                />
                <TextField v-model="cantidad" hint="Cantidad" class="mb-15" />

                <!-- Mostrar precio del teléfono seleccionado -->
                <StackLayout v-if="selectedSmartphone" class="mt-10">
                    <Label text="Total:" class="h3 mb-5" />
                    <Label :text="selectedSmartphone.Price*cantidad" class="detail-text" />
                </StackLayout>

                <!-- Botones -->
                <StackLayout class="mt-20" orientation="horizontal" horizontalAlignment="center">
                    <Button text="Guardar Local" class="btn btn-success mr-10" @tap="guardarLocal" />
                    <Button text="Guardar BD" class="btn btn-primary ml-10" @tap="guardarBD" />
                </StackLayout>

                <Button text="Atras" class="btn btn-secondary mt-10" @tap="goBack" />
            </StackLayout>

        </ScrollView>
    </Page>
</template>

<script>
import * as fs from '@nativescript/core/file-system'; // crear archivos localmente
import { PDFDocument, rgb } from 'pdf-lib';
import { knownFolders, path as fsPath } from '@nativescript/core/file-system';
import { isAndroid, Application } from '@nativescript/core';
//import { Application } from '@nativescript/core';
import { File } from '@nativescript/core/file-system';
//import { isAndroid } from '@nativescript/core/platform';

export default {
    data() {
        return {
            smartphones: [],    // Array con los datos de la BD
            selectedIndex: 0,   // Índice seleccionado en el DropDown
            cliente: '',         // Nombre del cliente ingresado
            cantidad: 1,        // inicia la cantidad en 1
            selectedSmartphone: null // Objeto del smartphone seleccionado
        };
    },
    computed: {
        
        smartphonesNames() {
            return this.smartphones.map(s => s.Model);
        },        
    },
    methods: {
        // Llamar a este método cuando inicies la pantalla o con un botón "Cargar"
        goBack() {
            this.$navigateTo(require('./Home.vue').default);
        },
        async cargarSmartphones() {
            try {
                const response = await fetch('https://cove-str-nissan-moore.trycloudflare.com/api/smartphones');
                const data = await response.json();
                this.smartphones = data;
                this.selectedIndex = 0; // Reinicias al primero
            } catch (error) {
                console.log('Error cargando smartphones:', error);
                alert('No se pudo cargar la lista de smartphones');
            }
        },
        // Función para manejar el evento @selectedIndexChanged
        dropDownSelectedIndexChanged() {
            // Actualiza selectedIndex con el valor actual
            this.selectedIndex = this.$refs.dropDownList.nativeView.selectedIndex;
            console.log("Índice actual:", this.selectedIndex); // Verifica el índice actual

            // Actualiza selectedSmartphone
            this.selectedSmartphone = this.smartphones[this.selectedIndex] || null;
        },
        async guardarLocal() {
            try {
                if (!this.selectedSmartphone) {
                    alert('No hay telefono seleccionado');
                    return;
                }
                if (!this.cliente) {
                    alert('Ingresa el nombre del cliente');
                    return;
                }

                // 1. Crear el contenido (uso de varias líneas).
                const invoiceContent = [          
                    
                    "-------------------------VamSmartphones-----------------------",                    
                    "Av. Hispanoamericana, Plaza Fernandez Modulo 209",
                    "Telefono: 829 712 4505 / 809 865 6009",                    
                    `Fecha: ${new Date().toDateString()}`,
                    "------------------------------------------------------------------",  
                    "Factura a:",                   
                    `Cliente: ${this.cliente}`,                    
                    "-------------------------------------------------------------------",  
                    `Teléfono: ${this.selectedSmartphone.Model}`,
                    `Cantidad: ${this.cantidad}`,
                    `Precio Unitario: $${this.selectedSmartphone.Price}.00`,
                    "-------------------------------------------------------------------",
                    `Total Facura: $${this.selectedSmartphone.Price*this.cantidad}.00`
                    
                ];

                // 2. Crear un documento PDF con pdf-lib
                const pdfDoc = await PDFDocument.create();
                const page = pdfDoc.addPage([320, 600]);  // 320 px de ancho, 600 px de alto    
                const { width, height } = page.getSize();            
                const font = await pdfDoc.embedStandardFont('Helvetica');

                // 3. Dibujar el texto línea a línea, y color negro
                // 4. Dibujar cada línea manualmente
                let yPos = height - 40; // Empieza 40 px debajo del tope
                for (const line of invoiceContent) {
                    page.drawText(line, {
                        x: 20,
                        y: yPos,
                        size: 12,
                        font,
                        color: rgb(0, 0, 0), //color negro
                    });
                    yPos -= 30; // Mover hacia abajo para la próxima línea
                }                
                
                // 4. Guardar PDF en memoria (binario)                
                let pdfBytes = await pdfDoc.save();
                if (!(pdfBytes instanceof Uint8Array)) {
                    pdfBytes = new Uint8Array(pdfBytes);
                }

                // 5. Guardar en un archivo local usando modo binario
                const documentsFolder = knownFolders.documents();
                const fileName = `Factura_${Date.now()}.pdf`;
                const filePath = fsPath.join(documentsFolder.path, fileName);                
                const javaFile = new java.io.File(filePath);
                const outputStream = new java.io.FileOutputStream(javaFile);

                const byteArray = Array.create('byte', pdfBytes.length);
                for (let i = 0; i < pdfBytes.length; i++) {
                    byteArray[i] = pdfBytes[i];
                }

                // Escribir y cerrar
                outputStream.write(byteArray);
                outputStream.flush();
                outputStream.close();                

                alert(`Factura guardada en: ${filePath}`);

                // 6. Abrir el PDF con un Intent y FileProvider (Android 7+)
                if (isAndroid) {
                    try {
                        const context = Application.android.context;
                        const currentActivity = Application.android.foregroundActivity || Application.android.startActivity;

                        let intent;
                        if (android.os.Build.VERSION.SDK_INT >= 24) {
                            // FileProvider
                            const apkURI = androidx.core.content.FileProvider.getUriForFile(
                                context,
                                context.getPackageName() + ".provider",
                                javaFile
                            );
                            intent = new android.content.Intent(android.content.Intent.ACTION_VIEW);
                            intent.setDataAndType(apkURI, "application/pdf");
                            intent.addFlags(android.content.Intent.FLAG_GRANT_READ_URI_PERMISSION);
                            intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NO_HISTORY);
                        } else {                            
                            intent = new android.content.Intent(android.content.Intent.ACTION_VIEW);
                            intent.setDataAndType(
                                android.net.Uri.parse("file://" + filePath),
                                "application/pdf"
                            );
                        }

                        currentActivity.startActivity(android.content.Intent.createChooser(intent, "Abrir PDF"));
                    } catch (e) {
                        console.log("Error abriendo PDF:", e);
                    }
                }

            } catch (err) {
                console.log("Error guardando PDF:", err);
                alert("No se pudo guardar la factura");
            }     
        },
        async guardarBD() {
            try {
                if (!this.selectedSmartphone) {
                    alert('No hay smartphone seleccionado');
                    return;
                }
                if (!this.cliente) {
                    alert('Ingresa el nombre del cliente');
                    return;
                }
                if (!this.cantidad) {
                    alert('Ingresa la cantidad a comprar, minimo 1');
                    return;
                }

                // Preparar payload
                const payload = {
                    cliente: this.cliente,
                    smartphone_id: this.selectedSmartphone.id,   // Asumiendo tu DB
                    cantidad: this.cantidad, // Podrías pedirlo en el form
                };

                const response = await fetch('https://cove-str-nissan-moore.trycloudflare.com/api/facturas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok) {
                    alert(`Factura guardada en la BD (ID: ${data.id || 'N/A'})`);
                } else {
                    alert(data.error || 'Error guardando en la BD');
                }
            } catch (error) {
                console.log('Error guardando factura en BD:', error);
                alert('No se pudo guardar la factura en la BD, se guardada en local');
                guardarLocal();
            }
        }
    },
    // Si quieres cargar la lista apenas entres a la pantalla:
    mounted() {
        this.cargarSmartphones();
    }
};
</script>

<style scoped>
.container {
    padding: 20;
}

.h2 {
    color: #333;
    font-weight: bold;
}

.mb-10 {
    margin-bottom: 10;
}

.mb-15 {
    margin-bottom: 15;
}

.mt-10 {
    margin-top: 10;
}

.mt-20 {
    margin-top: 20;
}

.detail-text {
    font-weight: bold;
    margin-bottom: 10;
}

.btn {
    padding: 10 20;
    border-radius: 5;
    font-weight: bold;
}

.btn-success {
    background-color: #4CAF50; /* Verde */
    color: white;
}

.btn-primary {
    background-color: #008CBA; /* Azul */
    color: white;
}

.btn-secondary {
    background-color: #6c757d; /* Gris */
    color: white;
}

.mr-10 {
    margin-right: 10;
}

.ml-10 {
    margin-left: 10;
}
</style>
