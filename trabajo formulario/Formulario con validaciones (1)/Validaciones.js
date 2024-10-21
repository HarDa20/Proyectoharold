class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.errors = {};
        this.firstErrorElement = null;
        this.initButtons();
        this.setupEventListeners();
        this.setupColorInput(); // Llama a la función para configurar el input de color
    }

    initButtons() {
        // Añadir eventos a los botones
        document.getElementById('clearBtn').addEventListener('click', () => this.formClear());
        document.getElementById('enableBtn').addEventListener('click', () => this.formEnabled());
        document.getElementById('disableBtn').addEventListener('click', () => this.formDisabled());
        document.getElementById('disableEditBtn').addEventListener('click', () => this.formDisableEdit(['nombreApellido', 'email']));
    }

    setupEventListeners() {
        document.getElementById("birthDate").addEventListener("change", this.calculateAge.bind(this));
        this.form.addEventListener("submit", this.validateForm.bind(this));

        // Validaciones en tiempo real
        document.getElementById("genero").addEventListener("change", this.validateGenero.bind(this, true));
        document.getElementById("documento").addEventListener("input", this.validateDocumento.bind(this, true));
        document.getElementById("nombreApellido").addEventListener("input", this.validateNombreApellido.bind(this, true));
        document.getElementById("telefono").addEventListener("input", this.validateTelefono.bind(this, true));
        document.getElementById("password").addEventListener("input", this.validatePassword.bind(this, true));
        document.getElementById("birthDate").addEventListener("change", this.validateBirthDate.bind(this, true));
        document.getElementById("tipoDocumento").addEventListener("change", this.validateTipoDocumento.bind(this, true));
        document.getElementById('email').addEventListener('input', this.validateEmail.bind(this, true));

        // Para hobbies y habilidades, se deben capturar cambios en los checkbox
        document.getElementsByName("hobbies").forEach(hobby => {
            hobby.addEventListener("change", this.validateHobbies.bind(this, true));
        });

        document.getElementsByName("habilidades").forEach(habilidad => {
            habilidad.addEventListener("change", this.validateHabilidades.bind(this, true));
        });
    }

    setupColorInput() {
        // Obtener el input de color
        const colorInput = document.getElementById('exampleColorInput');

        // Evento que cambia el fondo al seleccionar un color
        colorInput.addEventListener('input', function() {
            document.body.style.backgroundColor = colorInput.value; // Cambia el color de fondo
        });
    }

    calculateAge() {
        var birthDate = new Date(document.getElementById("birthDate").value);
        var today = new Date();
        var age = today.getFullYear() - birthDate.getFullYear();
        var monthDifference = today.getMonth() - birthDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        document.getElementById("edad").value = age;
        document.getElementById("edadOutput").textContent = age + " años";
    }

    validateForm(event) {
        this.errors = {};
        this.firstErrorElement = null;
        let valid = true;

        valid = this.validateGenero(valid);
        valid = this.validateDocumento(valid);
        valid = this.validateNombreApellido(valid);
        valid = this.validateTelefono(valid);
        valid = this.validatePassword(valid);
        valid = this.validateBirthDate(valid);
        valid = this.validateTipoDocumento(valid);
        valid = this.validateEmail(valid);
        valid = this.validateHobbies(valid);
        valid = this.validateHabilidades(valid);

        if (!valid) {
            event.preventDefault();
            console.log("Errores:", JSON.stringify(this.errors, null, 2));
            alert("Errores en el formulario:\n" + JSON.stringify(this.errors, null, 2));
            if (this.firstErrorElement) {
                this.firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                this.firstErrorElement.focus();
            }
        } else {
            alert("Formulario enviado exitosamente.");
        }
    }

    validateGenero(valid) {
        var genero = document.getElementById("genero").value;
        var generoField = document.getElementById("genero");

        if (genero === "") {
            valid = false;
            this.errors.genero = "Por favor, seleccione un género.";
            this.toggleErrorColor("generoError", "Por favor, seleccione un género.", generoField);
            generoField.classList.add('input-error');
            generoField.classList.remove('input-success');
            if (!this.firstErrorElement) this.firstErrorElement = generoField;
        } else {
            this.toggleErrorColor("generoError", "", generoField, true);
            generoField.classList.remove('input-error');
            generoField.classList.add('input-success');
        }
        return valid;
    }

    validateDocumento(valid) {
        var documento = document.getElementById("documento");

        if (documento.value.length < 10) {
            valid = false;
            this.errors.documento = "El documento debe tener al menos 10 números.";
            this.toggleErrorColor("documentoError", "El documento debe tener al menos 10 números.", documento);
            documento.classList.add('input-error');
            documento.classList.remove('input-success');
            if (!this.firstErrorElement) this.firstErrorElement = documento;
        } else {
            this.toggleErrorColor("documentoError", "", documento, true);
            documento.classList.remove('input-error');
            documento.classList.add('input-success');
        }
        return valid;
    }

    validateNombreApellido(valid) {
        var nombreApellido = document.getElementById("nombreApellido");

        if (!/^[A-Za-z\s]{3,}$/.test(nombreApellido.value)) {
            valid = false;
            this.errors.nombreApellido = "Debe tener solo letras.";
            this.toggleErrorColor("nombreApellidoError", "Debe tener solo letras.", nombreApellido);
            nombreApellido.classList.add('input-error');
            nombreApellido.classList.remove('input-success');
            if (!this.firstErrorElement) this.firstErrorElement = nombreApellido;
        } else {
            this.toggleErrorColor("nombreApellidoError", "", nombreApellido, true);
            nombreApellido.classList.remove('input-error');
            nombreApellido.classList.add('input-success');
        }
        return valid;
    }

    validateTelefono(valid) {
        var telefono = document.getElementById("telefono");

        if (!/^\d{10}$/.test(telefono.value)) {
            valid = false;
            this.errors.telefono = "El número debe tener 10 dígitos numéricos.";
            this.toggleErrorColor("telefonoError", "El número debe tener 10 dígitos numéricos.", telefono);
            telefono.classList.add('input-error');
            telefono.classList.remove('input-success');
            if (!this.firstErrorElement) this.firstErrorElement = telefono;
        } else {
            this.toggleErrorColor("telefonoError", "", telefono, true);
            telefono.classList.remove('input-error');
            telefono.classList.add('input-success');
        }
        return valid;
    }

    validatePassword(valid) {
        var password = document.getElementById("password");

        if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*[#\$%&*]).{8,}/.test(password.value)) {
            valid = false;
            this.errors.password = "Debe tener al menos 8 caracteres, una letra mayúscula, una minúscula y un carácter especial.";
            this.toggleErrorColor("passwordError", "Debe tener al menos 8 caracteres, una letra mayúscula, una minúscula y un carácter especial.", password);
            password.classList.add('input-error');
            password.classList.remove('input-success');
            if (!this.firstErrorElement) this.firstErrorElement = password;
        } else {
            this.toggleErrorColor("passwordError", "", password, true);
            password.classList.remove('input-error');
            password.classList.add('input-success');
        }
        return valid;
    }

    validateBirthDate(valid) {
        var birthDate = new Date(document.getElementById("birthDate").value);
        var today = new Date();
        var age = today.getFullYear() - birthDate.getFullYear();
        var monthDifference = today.getMonth() - birthDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        document.getElementById("edad").value = age;
        document.getElementById("edadOutput").textContent = age + " años";

        // Bloquear el formulario si el usuario es menor de 18 años
        if (age < 18) {
            valid = false;
            this.errors.birthDate = "Debes ser mayor de 18 años.";
            this.toggleErrorColor("birthDateError", "Debes ser mayor de 18 años.", document.getElementById("birthDate"));
            document.getElementById("birthDate").classList.add('input-error');
            document.getElementById("birthDate").classList.remove('input-success');

            // Desactivar todos los campos del formulario excepto "birthDate"
            this.toggleFormFields(true); // Bloquea campos
        } else {
            this.toggleErrorColor("birthDateError", "", document.getElementById("birthDate"), true);
            document.getElementById("birthDate").classList.remove('input-error');
            document.getElementById("birthDate").classList.add('input-success');

            // Habilitar campos del formulario si es mayor de 18 años
            this.toggleFormFields(false); // Desbloquea campos
        }

        return valid;
    }

    validateTipoDocumento(valid) {
        var tipoDocumento = document.getElementById("tipoDocumento").value;
        var age = document.getElementById("edad").value;
        var tipoDocumentoField = document.getElementById("tipoDocumento");
    
        // Verifica si el tipo de documento es "ti" y la edad es mayor o igual a 18
        if (tipoDocumento === "ti" && age >= 18) {
            valid = false;
            this.errors.tipoDocumento = "No puedes usar Tarjeta de Identidad si eres mayor de edad.";
            document.getElementById("tipoDocumentoError").textContent = "No puedes usar Tarjeta de Identidad si eres mayor de edad.";
            tipoDocumentoField.classList.add('input-error'); // Cambia a borde rojo
            tipoDocumentoField.classList.remove('input-success'); // Elimina borde verde
            if (!this.firstErrorElement) this.firstErrorElement = tipoDocumentoField;
        } else {
            document.getElementById("tipoDocumentoError").textContent = "";
            tipoDocumentoField.classList.remove('input-error'); // Elimina borde rojo
            tipoDocumentoField.classList.add('input-success'); // Cambia a borde verde
        }
        return valid;
    }

    validateEmail(valid) {
        var email = document.getElementById("email");
        var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regexEmail.test(email.value)) {
            valid = false;
            this.errors.email = "Por favor, ingrese un email válido.";
            this.toggleErrorColor("emailError", "Por favor, ingrese un email válido.", email);
            email.classList.add('input-error');
            email.classList.remove('input-success');
            if (!this.firstErrorElement) this.firstErrorElement = email;
        } else {
            this.toggleErrorColor("emailError", "", email, true);
            email.classList.remove('input-error');
            email.classList.add('input-success');
        }
        return valid;
    }

    validateHobbies(valid) {
        var hobbies = document.getElementsByName("hobbies");
        var checkedHobbies = Array.from(hobbies).some(hobby => hobby.checked);

        if (!checkedHobbies) {
            valid = false;
            this.errors.hobbies = "Debes seleccionar al menos un hobby.";
            this.toggleErrorColor("hobbiesError", "Debes seleccionar al menos un hobby.", hobbies[0]);
            if (!this.firstErrorElement) this.firstErrorElement = hobbies[0]; // Usar el primer hobby como referencia
        } else {
            this.toggleErrorColor("hobbiesError", "", hobbies[0], true);
        }
        return valid;
    }

    validateHabilidades(valid) {
        var habilidades = document.getElementsByName("habilidades");
        var checkedHabilidades = Array.from(habilidades).some(habilidad => habilidad.checked);

        if (!checkedHabilidades) {
            valid = false;
            this.errors.habilidades = "Debes seleccionar al menos una habilidad.";
            this.toggleErrorColor("habilidadesError", "Debes seleccionar al menos una habilidad.", habilidades[0]);
            if (!this.firstErrorElement) this.firstErrorElement = habilidades[0]; // Usar la primera habilidad como referencia
        } else {
            this.toggleErrorColor("habilidadesError", "", habilidades[0], true);
        }
        return valid;
    }

    toggleFormFields(disabled) {
        // Deshabilita o habilita todos los campos de entrada en el formulario
        const inputs = this.form.querySelectorAll("input, select, textarea");
        inputs.forEach(input => {
            if (input.id !== "birthDate") {
                input.disabled = disabled;
            }
        });
    }

    toggleErrorColor(elementId, message, field, isSuccess = false) {
        const errorElement = document.getElementById(elementId);
        if (message) {
            errorElement.textContent = message;
            errorElement.style.color = isSuccess ? "green" : "red"; // Color verde para éxito, rojo para error
        } else {
            errorElement.textContent = "";
        }
    }

    formClear() {
        this.form.reset();
        document.getElementById("edadOutput").textContent = "";
        document.querySelectorAll('.input-error, .input-success').forEach(el => el.classList.remove('input-error', 'input-success'));
        this.clearErrorMessages();
    }

    clearErrorMessages() {
        const errorMessages = ["generoError", "documentoError", "nombreApellidoError", "telefonoError", "passwordError", "birthDateError", "tipoDocumentoError", "emailError", "hobbiesError", "habilidadesError"];
        errorMessages.forEach(id => {
            document.getElementById(id).textContent = "";
        });
    }

    formEnabled() {
        this.toggleFormFields(false);
    }

    formDisabled() {
        this.toggleFormFields(true);
    }

    formDisableEdit(fields) {
        fields.forEach(field => {
            document.getElementById(field).disabled = true;
        });
    }
}

// Crear la instancia del validador cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
    const formValidator = new FormValidator("myForm");
    formValidator.setupColorInput(); // Llamar a la función para establecer el evento del input de color
});
