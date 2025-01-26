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
import { knownFolders, path } from '@nativescript/core'; // crear archivos localmente

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
        // Obtener el smartphone seleccionado según selectedIndex
        //selectedSmartphone() {
        //  return this.smartphones[this.selectedIndex] || null;
        //}
    },
    methods: {
        // Llamar a este método cuando inicies la pantalla o con un botón "Cargar"
        goBack() {
            this.$navigateTo(require('./Home.vue').default);
        },
        async cargarSmartphones() {
            try {
                const response = await fetch('https://push-excellence-ko-land.trycloudflare.com/api/smartphones');
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
        guardarLocal() {
            try {
                if (!this.selectedSmartphone) {
                    alert('No hay smartphone seleccionado');
                    return;
                }
                if (!this.cliente) {
                    alert('Ingresa el nombre del cliente ');
                    return;
                }

                // Crear un texto con los datos de la factura
                const invoiceContent = `
        FACTURA
        Cliente: ${this.cliente}
        Teléfono: ${this.selectedSmartphone.Model}
        Precio: ${this.selectedSmartphone.Price}
        Fecha: ${new Date().toLocaleString()}
        `;

                // Guardar en un archivo local (por ejemplo, en Documents/)
                const documents = knownFolders.documents();
                const fileName = `Factura_${Date.now()}.txt`; // o .pdf si deseas
                const filePath = path.join(documents.path, fileName);
                const file = documents.getFile(fileName);

                file.writeText(invoiceContent)
                    .then(() => {
                        alert(`Factura guardada localmente en ${filePath}`);
                    })
                    .catch((err) => {
                        console.error('Error escribiendo archivo:', err);
                        alert('No se pudo guardar la factura local');
                    });
            } catch (err) {
                console.log(err);
                alert('Error al guardar localmente');
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

                const response = await fetch('https://push-excellence-ko-land.trycloudflare.com/api/facturas', {
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
                alert('No se pudo guardar la factura en la BD');
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
