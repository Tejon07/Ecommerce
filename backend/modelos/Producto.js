// backend/modelos/Producto.js
const mysql = require('mysql2/promise');

// Configuración de la base de datos
const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: 'gabrielxd86', 
    database: 'ecomerce_db',
    port: 3306
};



class Producto {
    constructor() {
        this.connection = null;
    }

    // Crear conexión a la base de datos
    async conectar() {
        try {
            this.connection = await mysql.createConnection(dbConfig);
            console.log('Conexión exitosa a la base de datos');
        } catch (error) {
            console.error('Error al conectar con la base de datos:', error);
            throw error;
        }
    }

    // Cerrar conexión
    async desconectar() {
        if (this.connection) {
            await this.connection.end();
        }
    }

    // CREATE - Crear nuevo producto
    async crear(producto) {
        try {
            await this.conectar();
            
            const query = `
                INSERT INTO producto (nombre, descripcion, id_categoria, stock, precio_compra, precio_venta, imagen, activo) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            const valores = [
                producto.nombre,
                producto.descripcion,
                producto.id_categoria,
                producto.stock || 0,
                producto.precio_compra,
                producto.precio_venta,
                producto.imagen || '',
                producto.activo !== undefined ? producto.activo : 1
            ];
            
            const [resultado] = await this.connection.execute(query, valores);
            await this.desconectar();
            
            return {
                success: true,
                id: resultado.insertId,
                message: 'Producto creado exitosamente'
            };
            
        } catch (error) {
            await this.desconectar();
            console.error('Error al crear producto:', error);
            throw error;
        }
    }

    // READ - Obtener todos los productos
    async obtenerTodos() {
        try {
            await this.conectar();
            
            const query = `
                SELECT p.*, c.descripcion as categoria_nombre 
                FROM producto p 
                LEFT JOIN categoria c ON p.id_categoria = c.id_categoria 
                WHERE p.activo = 1
                ORDER BY p.fecha_registro DESC
            `;
            
            const [productos] = await this.connection.execute(query);
            await this.desconectar();
            
            return productos;
            
        } catch (error) {
            await this.desconectar();
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }

    // READ - Obtener producto por ID
    async obtenerPorId(id) {
        try {
            await this.conectar();
            
            const query = `
                SELECT p.*, c.descripcion as categoria_nombre 
                FROM producto p 
                LEFT JOIN categoria c ON p.id_categoria = c.id_categoria 
                WHERE p.id_producto = ? AND p.activo = 1
            `;
            
            const [productos] = await this.connection.execute(query, [id]);
            await this.desconectar();
            
            return productos.length > 0 ? productos[0] : null;
            
        } catch (error) {
            await this.desconectar();
            console.error('Error al obtener producto por ID:', error);
            throw error;
        }
    }

    // READ - Obtener productos por categoría
    async obtenerPorCategoria(idCategoria) {
        try {
            await this.conectar();
            
            const query = `
                SELECT p.*, c.descripcion as categoria_nombre 
                FROM producto p 
                LEFT JOIN categoria c ON p.id_categoria = c.id_categoria 
                WHERE p.id_categoria = ? AND p.activo = 1
                ORDER BY p.nombre
            `;
            
            const [productos] = await this.connection.execute(query, [idCategoria]);
            await this.desconectar();
            
            return productos;
            
        } catch (error) {
            await this.desconectar();
            console.error('Error al obtener productos por categoría:', error);
            throw error;
        }
    }

    // UPDATE - Actualizar producto
    async actualizar(id, producto) {
        try {
            await this.conectar();
            
            const query = `
                UPDATE producto 
                SET nombre = ?, descripcion = ?, id_categoria = ?, stock = ?, 
                    precio_compra = ?, precio_venta = ?, imagen = ?, activo = ?
                WHERE id_producto = ?
            `;
            
            const valores = [
                producto.nombre,
                producto.descripcion,
                producto.id_categoria,
                producto.stock,
                producto.precio_compra,
                producto.precio_venta,
                producto.imagen,
                producto.activo !== undefined ? producto.activo : 1,
                id
            ];
            
            const [resultado] = await this.connection.execute(query, valores);
            await this.desconectar();
            
            if (resultado.affectedRows === 0) {
                return {
                    success: false,
                    message: 'Producto no encontrado'
                };
            }
            
            return {
                success: true,
                message: 'Producto actualizado exitosamente'
            };
            
        } catch (error) {
            await this.desconectar();
            console.error('Error al actualizar producto:', error);
            throw error;
        }
    }

    // DELETE - Eliminar producto (borrado lógico)
    async eliminar(id) {
        try {
            await this.conectar();
            
            const query = `UPDATE producto SET activo = 0 WHERE id_producto = ?`;
            
            const [resultado] = await this.connection.execute(query, [id]);
            await this.desconectar();
            
            if (resultado.affectedRows === 0) {
                return {
                    success: false,
                    message: 'Producto no encontrado'
                };
            }
            
            return {
                success: true,
                message: 'Producto eliminado exitosamente'
            };
            
        } catch (error) {
            await this.desconectar();
            console.error('Error al eliminar producto:', error);
            throw error;
        }
    }

    // Método adicional para búsqueda por nombre
    async buscarPorNombre(nombre) {
        try {
            await this.conectar();
            
            const query = `
                SELECT p.*, c.descripcion as categoria_nombre 
                FROM producto p 
                LEFT JOIN categoria c ON p.id_categoria = c.id_categoria 
                WHERE p.nombre LIKE ? AND p.activo = 1
                ORDER BY p.nombre
            `;
            
            const [productos] = await this.connection.execute(query, [`%${nombre}%`]);
            await this.desconectar();
            
            return productos;
            
        } catch (error) {
            await this.desconectar();
            console.error('Error al buscar productos:', error);
            throw error;
        }
    }

    // Método adicional para obtener categorías
    async obtenerCategorias() {
        try {
            await this.conectar();
            
            const query = `SELECT * FROM categoria WHERE activo = 1 ORDER BY descripcion`;
            
            const [categorias] = await this.connection.execute(query);
            await this.desconectar();
            
            return categorias;
            
        } catch (error) {
            await this.desconectar();
            console.error('Error al obtener categorías:', error);
            throw error;
        }
    }
}

module.exports = Producto;