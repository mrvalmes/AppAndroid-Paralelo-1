<template>
  <Page>
    <ActionBar title="Detalle de Smartphone" />
    <ScrollView>
      <StackLayout class="p-20">
        <!-- DropDown para seleccionar el smartphone -->
        <DropDown
          ref="dropDownList"
          :items="smartphonesNames"
          v-model="selectedIndex"
          hint="Seleccione un smartphone"
          class="dropdown-style"
          @selectedIndexChanged="dropDownSelectedIndexChanged"
        />
        <Button
          text="Mostrar Detalles"
          class="btn-mostrar"
          @tap="showDetails"
        />

        <!-- Mostrar detalles del smartphone seleccionado -->
        <StackLayout v-if="selectedSmartphone" class="details-container">
          <Label text="Información del Smartphone" class="h3 mb-10" />

          <Label class="icon-label" text="❤️‍🔥 Modelo:" />
          <Label :text="selectedSmartphone.Model" class="detail-text mb-5" />

          <Label class="icon-label" text="🚀 RAM:" />
          <Label :text="selectedSmartphone.Ram + ' GB'" class="detail-text mb-5" />

          <Label class="icon-label" text="⚡ ROM:" />
          <Label :text="selectedSmartphone.Rom + ' GB'" class="detail-text mb-5" />

          <Label class="icon-label" text="💲 Precio:" />
          <Label :text="'$' + selectedSmartphone.Price" class="detail-text mb-5" />

          <Label class="icon-label" text="🔥Vista:" />
          <Image
            v-if="selectedSmartphone.Img"
            :src="selectedSmartphone.Img"
            class="phone-img"
          />
        </StackLayout>

        <!-- Botón Regresar -->
        <Button
          text="Regresar"
          class="btn-back"
          @tap="goBack"
        />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
export default {
    data() {
        return {
            smartphones: [],
            selectedIndex: 0, // Índice seleccionado en el DropDown
            showDetailsSection: false, // Variable para controlar la visibilidad de los detalles
            selectedSmartphone: null // Objeto del smartphone seleccionado
        };
    },
    computed: {
        // Arreglo de strings para mostrar en el DropDown
        smartphonesNames() {
            return this.smartphones.map(s => s.Model);
        }
    },
    mounted() {
        // Cargar la lista al montar la vista
        this.cargarSmartphones();
    },
    methods: {
        async cargarSmartphones() {
            try {
                const response = await fetch('https://push-excellence-ko-land.trycloudflare.com/api/smartphones');
                const data = await response.json();
                this.smartphones = data;
            } catch (err) {
                console.log(err);
                alert('No se pudo cargar la lista de smartphones');
            }
        },
        // Función para manejar el evento @selectedIndexChanged
        dropDownSelectedIndexChanged() {
            // Actualiza selectedIndex con el valor actual
            this.selectedIndex = this.$refs.dropDownList.nativeView.selectedIndex;
            console.log("Índice actual:", this.selectedIndex); // Verifica el índice actual
        },
        async showDetails() {
            try {
                // Obtén el ID del smartphone seleccionado
                const selectedSmartphoneId = this.smartphones[this.selectedIndex]?.id || null;

                if (selectedSmartphoneId) {
                    const response = await fetch(
                        `https://push-excellence-ko-land.trycloudflare.com/api/smartphones/${selectedSmartphoneId}`
                    );
                    const data = await response.json();
                    this.selectedSmartphone = data; // Actualiza el smartphone seleccionado
                    this.showDetailsSection = true; // Muestra la sección de detalles
                } else {
                    alert('No se ha seleccionado un smartphone');
                }
            } catch (err) {
                console.log(err);
                alert('No se pudo cargar los detalles del smartphone');
            }
        },
        goBack() {
            this.$navigateBack();
        }
    }
};
</script>

<style scoped>
.dropdown-style {
margin-top: 20;
margin-bottom: 20;
background-color: #eaeaea;
font-size: 16;
color: #333;
border-radius: 4;
padding: 8;
}

.details-container {
background-color: #f2f2f2;
border-radius: 6;
padding: 16;
margin-bottom: 20;
}

.phone-img {
width: 200;
height: 200;
margin-top: 10;
margin-bottom: 10;
}

.btn-back {
background-color: #b44f4c;
color: white;
font-weight: bold;
margin-top: 20;
padding: 12 16;
border-radius: 6;
}

.btn-mostrar {
background-color: #0c30d1;
color: white;
font-weight: bold;
margin-top: 10;
padding: 8 10;
border-radius: 6;
}

.icon-label {
font-weight: bold;
margin-top: 8;
}
.detail-text {
margin-bottom: 10;
}
</style>
