// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Vuetify
import { createVuetify } from 'vuetify';
import { VDataTable } from 'vuetify/labs/components';

const customTheme = {
    dark: false,
    colors: {
        primary: '#448df8',
        success: '#00bd00',
        error: '#e53b3b'
    }
};

export default createVuetify({
    components: {
        VDataTable
    },
    theme: {
        defaultTheme: 'customTheme',
        themes: {
            customTheme
        }
    }
});
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
