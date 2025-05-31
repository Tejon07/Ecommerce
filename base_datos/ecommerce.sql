-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 30, 2025 at 11:52 PM
-- Server version: 8.0.42
-- PHP Version: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecommerce`
--

-- --------------------------------------------------------

--
-- Table structure for table `carrito`
--

CREATE TABLE `carrito` (
  `CarritoID` int NOT NULL,
  `UsuarioID` int NOT NULL,
  `FechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `FechaModif` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `carritoitem`
--

CREATE TABLE `carritoitem` (
  `CarritoItemID` int NOT NULL,
  `CarritoID` int NOT NULL,
  `ProductoID` int NOT NULL,
  `Cantidad` int NOT NULL,
  `PrecioGuardado` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categoria`
--

CREATE TABLE `categoria` (
  `CategoriaID` int NOT NULL,
  `Nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categoria`
--

INSERT INTO `categoria` (`CategoriaID`, `Nombre`) VALUES
(1, 'Abrigos'),
(2, 'Camisas'),
(3, 'Pantalones'),
(4, 'Zapatos');

-- --------------------------------------------------------

--
-- Table structure for table `compra`
--

CREATE TABLE `compra` (
  `CompraID` int NOT NULL,
  `UsuarioID` int NOT NULL,
  `FechaCompra` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Estado` enum('pendiente','pagado','enviado','entregado','cancelado') NOT NULL,
  `Total` decimal(12,2) NOT NULL,
  `DireccionEnvio` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `detallecompras`
--

CREATE TABLE `detallecompras` (
  `DetalleVentaID` int NOT NULL,
  `CompraID` int NOT NULL,
  `ProveedorID` int NOT NULL,
  `ProductoID` int NOT NULL,
  `CantidadVendida` int NOT NULL,
  `Ingreso` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pago`
--

CREATE TABLE `pago` (
  `PagoID` int NOT NULL,
  `CompraID` int NOT NULL,
  `FechaPago` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Metodo` enum('tarjeta','paypal','transferencia','efectivo') NOT NULL,
  `Monto` decimal(12,2) NOT NULL,
  `Referencia` varchar(100) DEFAULT NULL,
  `Estado` enum('pendiente','completado','fallido') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `producto`
--

CREATE TABLE `producto` (
  `ProductoID` int NOT NULL,
  `ProveedorID` int NOT NULL,
  `CategoriaID` int NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Descripcion` text NOT NULL,
  `PrecioUnitario` decimal(10,2) NOT NULL,
  `StockCantidad` int NOT NULL DEFAULT '0',
  `Talla` varchar(50) DEFAULT NULL,
  `Colores` varchar(100) DEFAULT NULL,
  `ImagenURL` varchar(255) DEFAULT NULL,
  `FechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `FechaModif` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `producto`
--

INSERT INTO `producto` (`ProductoID`, `ProveedorID`, `CategoriaID`, `Nombre`, `Descripcion`, `PrecioUnitario`, `StockCantidad`, `Talla`, `Colores`, `ImagenURL`, `FechaCreacion`, `FechaModif`) VALUES
(1, 2, 1, 'Abrigo Invernal', 'Abrigo grueso para clima frío', 120.00, 10, 'M', 'negro,gris', 'imagenes/abrigo_negro.jpg', '2025-05-30 19:51:48', '2025-05-30 19:51:48'),
(2, 2, 2, 'Camisa Manga Larga', 'Camisa de algodón premium', 45.50, 25, 'L', 'blanco,azul', 'imagenes/camisa_manga_larga.jpg', '2025-05-30 19:51:48', '2025-05-30 19:51:48'),
(3, 2, 3, 'Pantalón Jeans', 'Jeans clásico ajustado', 60.00, 30, '32', 'azul', 'imagenes/pantalon_jeans.jpg', '2025-05-30 19:51:48', '2025-05-30 19:51:48');

-- --------------------------------------------------------

--
-- Table structure for table `rol`
--

CREATE TABLE `rol` (
  `RolID` int NOT NULL,
  `Nombre` varchar(20) NOT NULL,
  `Descripcion` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `rol`
--

INSERT INTO `rol` (`RolID`, `Nombre`, `Descripcion`) VALUES
(1, 'GrandMaster', 'Superusuario con todos los permisos'),
(2, 'Admin', 'Administrador del sistema'),
(3, 'Cliente', 'Usuario que compra productos'),
(4, 'Delivery', 'Repartidor de pedidos');

-- --------------------------------------------------------

--
-- Table structure for table `usuario`
--

CREATE TABLE `usuario` (
  `UsuarioID` int NOT NULL,
  `RolID` int NOT NULL,
  `Email` varchar(255) NOT NULL,
  `PasswordHash` varchar(255) DEFAULT NULL,
  `OAuthProvider` varchar(50) DEFAULT NULL,
  `OAuthID` varchar(100) DEFAULT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Apellido` varchar(50) NOT NULL,
  `Telefono` varchar(20) DEFAULT NULL,
  `FechaRegistro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `usuario`
--

INSERT INTO `usuario` (`UsuarioID`, `RolID`, `Email`, `PasswordHash`, `OAuthProvider`, `OAuthID`, `Nombre`, `Apellido`, `Telefono`, `FechaRegistro`) VALUES
(1, 1, 'papitas33fritas@gmail.com', 'HASH1', NULL, NULL, 'Papita', 'Frita', '721000001', '2025-05-30 19:51:19'),
(2, 2, 'admin@gmail.com', 'HASH2', NULL, NULL, 'Gabriel', 'Menacho', '721000002', '2025-05-30 19:51:19'),
(3, 3, 'cliente@gmail.com', 'HASH3', 'facebook', 'FB123', 'Carlos', 'López', '721000003', '2025-05-30 19:51:19'),
(4, 4, 'delivery@gmail.com', 'HASH4', NULL, NULL, 'Yerko', 'Jimenez', '721000004', '2025-05-30 19:51:19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`CarritoID`),
  ADD UNIQUE KEY `UQ_Carrito_Usuario` (`UsuarioID`),
  ADD KEY `FK_Carrito_Usuario` (`UsuarioID`);

--
-- Indexes for table `carritoitem`
--
ALTER TABLE `carritoitem`
  ADD PRIMARY KEY (`CarritoItemID`),
  ADD KEY `FK_CarritoItem_Carrito` (`CarritoID`),
  ADD KEY `FK_CarritoItem_Producto` (`ProductoID`);

--
-- Indexes for table `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`CategoriaID`),
  ADD UNIQUE KEY `UQ_Categoria_Nombre` (`Nombre`);

--
-- Indexes for table `compra`
--
ALTER TABLE `compra`
  ADD PRIMARY KEY (`CompraID`),
  ADD KEY `FK_Compra_Usuario` (`UsuarioID`);

--
-- Indexes for table `detallecompras`
--
ALTER TABLE `detallecompras`
  ADD PRIMARY KEY (`DetalleVentaID`),
  ADD KEY `FK_DetalleVenta_Compra` (`CompraID`),
  ADD KEY `FK_DetalleVenta_Proveedor` (`ProveedorID`),
  ADD KEY `FK_DetalleVenta_Producto` (`ProductoID`);

--
-- Indexes for table `pago`
--
ALTER TABLE `pago`
  ADD PRIMARY KEY (`PagoID`),
  ADD KEY `FK_Pago_Compra` (`CompraID`);

--
-- Indexes for table `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`ProductoID`),
  ADD KEY `FK_Producto_Proveedor` (`ProveedorID`),
  ADD KEY `FK_Producto_Categoria` (`CategoriaID`);

--
-- Indexes for table `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`RolID`),
  ADD UNIQUE KEY `UQ_Rol_Nombre` (`Nombre`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`UsuarioID`),
  ADD UNIQUE KEY `UQ_Usuario_Email` (`Email`),
  ADD KEY `FK_Usuario_Rol` (`RolID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carrito`
--
ALTER TABLE `carrito`
  MODIFY `CarritoID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `carritoitem`
--
ALTER TABLE `carritoitem`
  MODIFY `CarritoItemID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categoria`
--
ALTER TABLE `categoria`
  MODIFY `CategoriaID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `compra`
--
ALTER TABLE `compra`
  MODIFY `CompraID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `detallecompras`
--
ALTER TABLE `detallecompras`
  MODIFY `DetalleVentaID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pago`
--
ALTER TABLE `pago`
  MODIFY `PagoID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `producto`
--
ALTER TABLE `producto`
  MODIFY `ProductoID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `rol`
--
ALTER TABLE `rol`
  MODIFY `RolID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `usuario`
--
ALTER TABLE `usuario`
  MODIFY `UsuarioID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `FK_Carrito_Usuario` FOREIGN KEY (`UsuarioID`) REFERENCES `usuario` (`UsuarioID`);

--
-- Constraints for table `carritoitem`
--
ALTER TABLE `carritoitem`
  ADD CONSTRAINT `FK_CarritoItem_Carrito` FOREIGN KEY (`CarritoID`) REFERENCES `carrito` (`CarritoID`),
  ADD CONSTRAINT `FK_CarritoItem_Producto` FOREIGN KEY (`ProductoID`) REFERENCES `producto` (`ProductoID`);

--
-- Constraints for table `compra`
--
ALTER TABLE `compra`
  ADD CONSTRAINT `FK_Compra_Usuario` FOREIGN KEY (`UsuarioID`) REFERENCES `usuario` (`UsuarioID`);

--
-- Constraints for table `detallecompras`
--
ALTER TABLE `detallecompras`
  ADD CONSTRAINT `FK_DetalleVenta_Compra` FOREIGN KEY (`CompraID`) REFERENCES `compra` (`CompraID`),
  ADD CONSTRAINT `FK_DetalleVenta_Producto` FOREIGN KEY (`ProductoID`) REFERENCES `producto` (`ProductoID`),
  ADD CONSTRAINT `FK_DetalleVenta_Proveedor` FOREIGN KEY (`ProveedorID`) REFERENCES `usuario` (`UsuarioID`);

--
-- Constraints for table `pago`
--
ALTER TABLE `pago`
  ADD CONSTRAINT `FK_Pago_Compra` FOREIGN KEY (`CompraID`) REFERENCES `compra` (`CompraID`);

--
-- Constraints for table `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `FK_Producto_Categoria` FOREIGN KEY (`CategoriaID`) REFERENCES `categoria` (`CategoriaID`),
  ADD CONSTRAINT `FK_Producto_Proveedor` FOREIGN KEY (`ProveedorID`) REFERENCES `usuario` (`UsuarioID`);

--
-- Constraints for table `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `FK_Usuario_Rol` FOREIGN KEY (`RolID`) REFERENCES `rol` (`RolID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
