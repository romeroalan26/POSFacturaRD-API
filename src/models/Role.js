const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        enum: ['admin', 'cajero', 'inventario', 'invitado']
    },
    description: {
        type: String,
        required: true
    },
    permissions: {
        products: {
            view: { type: Boolean, default: false },
            create: { type: Boolean, default: false },
            update: { type: Boolean, default: false },
            delete: { type: Boolean, default: false }
        },
        sales: {
            view: { type: Boolean, default: false },
            create: { type: Boolean, default: false },
            update: { type: Boolean, default: false },
            delete: { type: Boolean, default: false }
        },
        reports: {
            view: { type: Boolean, default: false },
            export: { type: Boolean, default: false }
        },
        users: {
            view: { type: Boolean, default: false },
            create: { type: Boolean, default: false },
            update: { type: Boolean, default: false },
            delete: { type: Boolean, default: false }
        }
    }
}, {
    timestamps: true
});

// Método estático para inicializar los roles por defecto
roleSchema.statics.initializeRoles = async function () {
    const defaultRoles = [
        {
            name: 'admin',
            description: 'Dueño o supervisor. Accede a todo.',
            permissions: {
                products: { view: true, create: true, update: true, delete: true },
                sales: { view: true, create: true, update: true, delete: true },
                reports: { view: true, export: true },
                users: { view: true, create: true, update: true, delete: true }
            }
        },
        {
            name: 'cajero',
            description: 'Operador de caja. Vende productos.',
            permissions: {
                products: { view: true, create: false, update: false, delete: false },
                sales: { view: true, create: true, update: false, delete: false },
                reports: { view: true, export: false },
                users: { view: false, create: false, update: false, delete: false }
            }
        },
        {
            name: 'inventario',
            description: 'Encargado de stock.',
            permissions: {
                products: { view: true, create: true, update: true, delete: false },
                sales: { view: false, create: false, update: false, delete: false },
                reports: { view: true, export: true },
                users: { view: false, create: false, update: false, delete: false }
            }
        },
        {
            name: 'invitado',
            description: 'Rol opcional, solo lectura. Ideal para pruebas o vistas demo.',
            permissions: {
                products: { view: true, create: false, update: false, delete: false },
                sales: { view: true, create: false, update: false, delete: false },
                reports: { view: true, export: false },
                users: { view: false, create: false, update: false, delete: false }
            }
        }
    ];

    for (const role of defaultRoles) {
        await this.findOneAndUpdate(
            { name: role.name },
            role,
            { upsert: true, new: true }
        );
    }
};

const Role = mongoose.model('Role', roleSchema);

module.exports = Role; 