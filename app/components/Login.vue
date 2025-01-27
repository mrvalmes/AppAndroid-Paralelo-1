<template>
    <Page class="page">
        <ActionBar title="Iniciar Sesion" />
        <StackLayout class="p-20" verticalAlignment="center">
            <TextField v-model="email" hint="email" />
            <TextField v-model="pass" hint="pass" secure="true" />
            <Button text="Iniciar Sesión" @tap="onLogin" class="btn btn-primary mt-10" />
            <!-- Botón para ir al registro -->
            <Button text="¿No tienes cuenta? ¡Regístrate!" @tap="goRegister" class="btn btn-secondary mt-10" />
        </StackLayout>
    </Page>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            email: '',
            pass: ''
        };        
},
    methods: {
        ...mapActions([]), // Más adelante podemos mapear la acción de login si la definimos en store
        async onLogin() {
            try {
                const response = await fetch('https://cove-str-nissan-moore.trycloudflare.com/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: this.email,
                        pass: this.pass
                    })
                });
                const data = await response.json();

                if (data.success) {
                    // Guardas el token en tu store o variable:
                    const token = data.token;
                    alert('Bienvenido ' + data.user.nombre);
                    // Guardar info en Vuex o en memoria
                    this.$navigateTo(require('./Home.vue').default);
                } else {
                    alert(data.error || 'Error de credenciales');
                    
                }
            } catch (error) {
                console.log("Error tipo: ",error);
                alert('No se pudo conectar con el servidor');
            }
        },
        goRegister() {
            // Navegar a la pantalla de registro
            this.$navigateTo(require('./Register.vue').default);
        }
    }
};
</script>

<style scoped>
.page {
    background-color: #f0f0f0;
}
</style>
