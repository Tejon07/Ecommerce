const Producto = require('../modelos/Producto');
const productoModel = new Producto();


class ProductoControlador {
    constructor() {
        this.productoModel = new Producto();
    }

    // Crear nuevo producto
    async crear(req, res) {
        try {
            const { nombre, descripcion, id_categoria, stock, precio_compra, precio_venta, imagen } = req.body;

            // Validaciones básicas
            if (!nombre || !id_categoria || !precio_compra || !precio_venta) {
                return res.status(400).json({
                    success: false,
                    message: 'Los campos nombre, categoría, precio de compra y precio de venta son obligatorios'
                });
            }

            // Validar que los precios sean números positivos
            if (precio_compra <= 0 || precio_venta <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Los precios deben ser números positivos'
                });
            }

            // Validar que el stock sea un número no negativo
            if (stock < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El stock no puede ser negativo'
                });
            }

            const nuevoProducto = {
                nombre,
                descripcion,
                id_categoria,
                stock: stock || 0,
                precio_compra,
                precio_venta,
                imagen: imagen || '',
                activo: 1
            };

            const resultado = await productoModel.crear(nuevoProducto);
            
            res.status(201).json({
                success: true,
                data: {
                    id: resultado.id,
                    ...nuevoProducto
                },
                message: 'Producto creado exitosamente'
            });

        } catch (error) {
            console.error('Error en controlador crear producto:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Obtener todos los productos
    async obtenerTodos(req, res) {
        try {
            const productos = await productoModel.obtenerTodos();

            
            res.status(200).json({
                success: true,
                data: productos,
                total: productos.length,
                message: 'Productos obtenidos exitosamente'
            });

        } catch (error) {
            console.error('Error en controlador obtener productos:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Obtener producto por ID
    async obtenerPorId(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de producto inválido'
                });
            }

            const producto = await productoModel.obtenerPorId(id);
            
            if (!producto) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                data: producto,
                message: 'Producto obtenido exitosamente'
            });

        } catch (error) {
            console.error('Error en controlador obtener producto por ID:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Obtener productos por categoría
    async obtenerPorCategoria(req, res) {
        try {
            const { idCategoria } = req.params;

            if (!idCategoria || isNaN(idCategoria)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de categoría inválido'
                });
            }

            const productos = await productoModel.obtenerPorCategoria(idCategoria);
            
            res.status(200).json({
                success: true,
                data: productos,
                total: productos.length,
                message: 'Productos obtenidos exitosamente'
            });

        } catch (error) {
            console.error('Error en controlador obtener productos por categoría:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Actualizar producto
    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const { nombre, descripcion, id_categoria, stock, precio_compra, precio_venta, imagen, activo } = req.body;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de producto inválido'
                });
            }

            // Validaciones básicas
            if (!nombre || !id_categoria || !precio_compra || !precio_venta) {
                return res.status(400).json({
                    success: false,
                    message: 'Los campos nombre, categoría, precio de compra y precio de venta son obligatorios'
                });
            }

            // Validar que los precios sean números positivos
            if (precio_compra <= 0 || precio_venta <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Los precios deben ser números positivos'
                });
            }

            const productoActualizado = {
                nombre,
                descripcion,
                id_categoria,
                stock: stock || 0,
                precio_compra,
                precio_venta,
                imagen: imagen || '',
                activo: activo !== undefined ? activo : 1
            };

            const resultado = await productoModel.actualizar(id, productoActualizado);
            
            if (!resultado.success) {
                return res.status(404).json(resultado);
            }

            res.status(200).json({
                success: true,
                data: {
                    id: parseInt(id),
                    ...productoActualizado
                },
                message: 'Producto actualizado exitosamente'
            });

        } catch (error) {
            console.error('Error en controlador actualizar producto:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Eliminar producto
    async eliminar(req, res) {
        try {
            const { id } = req.params;
        console.log('Intentando eliminar producto ID:', id);  // <--- Añade esto
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de producto inválido'
                });
            }

            const resultado = await productoModel.eliminar(id);
                    console.log('Resultado eliminación:', resultado);  // <--- Y esto también
            if (!resultado.success) {
                return res.status(404).json(resultado);
            }

            res.status(200).json({
                success: true,
                message: 'Producto eliminado exitosamente'
            });

        } catch (error) {
            console.error('Error en controlador eliminar producto:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Buscar productos por nombre
    async buscarPorNombre(req, res) {
        try {
            const { nombre } = req.query;

            if (!nombre || nombre.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'El parámetro de búsqueda nombre es requerido'
                });
            }

            const productos = await productoModel.buscarPorNombre(nombre.trim());
            
            res.status(200).json({
                success: true,
                data: productos,
                total: productos.length,
                message: `Se encontraron ${productos.length} productos`
            });

        } catch (error) {
            console.error('Error en controlador buscar productos:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Obtener categorías disponibles
    async obtenerCategorias(req, res) {
        try {
            const categorias = await productoModel.obtenerCategorias();
            
            res.status(200).json({
                success: true,
                data: categorias,
                total: categorias.length,
                message: 'Categorías obtenidas exitosamente'
            });

        } catch (error) {
            console.error('Error en controlador obtener categorías:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
}

module.exports = new ProductoControlador();