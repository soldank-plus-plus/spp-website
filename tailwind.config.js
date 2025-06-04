/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
    	extend: {
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		fontFamily: {
    			tomorrow: [
    				'Tomorrow',
    				'Roboto',
    				'sans-serif'
    			]
    		},
    		fontWeight: {
    			'450': '450'
    		},
    		colors: {
    			background: '#000000',
    			foreground: '#ebebeb',
    			primary: '#000000',
    			secondary: '#999999',
    			border: '#A6A8B4',
    			heading: '#ebebeb',
    			dark: '#9CA3AF',
    			light: '#FFFFFFB3',
    			sombre: '#111111',
    			accent: '#2e4183',
    			accenthover: '#2c3350',
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out'
    		}
    	}
    },
    plugins: [require("tailwindcss-animate")],
};
