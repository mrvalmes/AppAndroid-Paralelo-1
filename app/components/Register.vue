<template>
    <Page>
        <ActionBar title="Registro de Usuario" />
        <StackLayout class="p-20">
            <TextField v-model="nombre" hint="Nombre" />
            <TextField v-model="email" hint="Correo" keyboardType="email" />
            <TextField v-model="pass" hint="Contraseña" secure="true" />
            <TextField v-model="telefono" hint="Teléfono" keyboardType="phone" />
            <Button text="Registrar" @tap="onRegister" class="btn btn-primary mt-10" />
        </StackLayout>
    </Page>
</template>

<script>
export default {
    data() {
        return {
            nombre: '',
            email: '',
            pass: '',
            telefono: ''
        };
    },
    methods: {
        async onRegister() {
            try {
                const payload = {
                    nombre: this.nombre,
                    email: this.email,
                    pass: this.pass,  // Se enviará y en el server se hashea con Hash::make
                    telefono: this.telefono
                };

                const response = await fetch('https://push-excellence-ko-land.trycloudflare.com/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    alert('Usuario registrado correctamente');
                    // Podrías guardar el token data.token si deseas
                    token = data.token;
                     this.$navigateBack(); // o ir a login
                } else {
                    alert('Error al registrar: ' + (data.error || 'desconocido'));
                }
            } catch (error) {
                console.error(error);
                alert('Error de conexión');
            }
        }
    }
};
</script>

<style scoped></style>
