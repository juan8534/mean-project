-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tiempo de generación: 18-11-2017 a las 02:00:50
-- Versión del servidor: 10.1.19-MariaDB
-- Versión de PHP: 5.6.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `multas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `multa`
--

CREATE TABLE `multa` (
  `id_multa` int(10) NOT NULL,
  `fecha_multa` date NOT NULL,
  `id_placa` varchar(7) NOT NULL,
  `descripcion_multa` varchar(200) NOT NULL,
  `estado_multa` tinyint(1) NOT NULL DEFAULT '1',
  `valor_multa` double NOT NULL,
  `id_cedula` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `multa`
--

INSERT INTO `multa` (`id_multa`, `fecha_multa`, `id_placa`, `descripcion_multa`, `estado_multa`, `valor_multa`, `id_cedula`) VALUES
(3, '2017-11-12', 'HSK39D', 'Se paso el semaforo en rojo', 2, 300000, 1107073253),
(4, '2017-11-15', 'HSK39D', 'Multa por andar borracho', 1, 300000, 1107073253),
(5, '2017-11-17', 'QHD34S', 'Multa por andar ebrio', 1, 200000, 168439),
(6, '2017-11-15', 'WAS23Q', 'Exceso de velocidad', 1, 100000, 110244);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `propietario`
--

CREATE TABLE `propietario` (
  `id_cedulapro` int(10) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `apellido` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `propietario`
--

INSERT INTO `propietario` (`id_cedulapro`, `nombre`, `apellido`) VALUES
(110244, 'Armando', 'Paredes'),
(168439, 'Cristian Andres', 'Cardenas osorio'),
(1107073253, 'Juan Pablo', 'Vargas Salas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vehiculo`
--

CREATE TABLE `vehiculo` (
  `placa` varchar(7) NOT NULL,
  `modelo` varchar(100) NOT NULL,
  `fecha_modelo` int(10) NOT NULL,
  `id_propietario` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `vehiculo`
--

INSERT INTO `vehiculo` (`placa`, `modelo`, `fecha_modelo`, `id_propietario`) VALUES
('abc123', 'mazda', 2017, 168439),
('HSK39D', 'Moto tvs apache', 2015, 1107073253),
('KJS32Q', 'Kawasaki Ninja', 2017, 168439),
('QHD34S', 'Moto AKT TTTTTT', 2015, 168439),
('ss', 'sss', 0, 0),
('WAS23Q', 'TVS RACING', 2016, 110244);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `multa`
--
ALTER TABLE `multa`
  ADD PRIMARY KEY (`id_multa`);

--
-- Indices de la tabla `propietario`
--
ALTER TABLE `propietario`
  ADD PRIMARY KEY (`id_cedulapro`);

--
-- Indices de la tabla `vehiculo`
--
ALTER TABLE `vehiculo`
  ADD PRIMARY KEY (`placa`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `multa`
--
ALTER TABLE `multa`
  MODIFY `id_multa` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
