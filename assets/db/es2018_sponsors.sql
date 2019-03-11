CREATE TABLE `sponsor` (
  `id` int(11) NOT NULL,
  `skill` varchar(100) DEFAULT NULL,
  `sponsor` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `sponsor` (`id`, `skill`, `sponsor`) VALUES
(1, 'main sponsor', 'Audi Hungaria Zrt.'),
(2, 'main sponsor', 'DMG MORI Hungary Kft.'),
(3, 'main sponsor', 'Festo Kft.'),
(4, 'main sponsor', 'KITE Zrt.'),
(5, 'main sponsor', 'Mercedes-Benz Manufacturing Hungary Kft.'),
(6, 'main sponsor', 'SIEMENS'),
(7, 'main sponsor', 'Nemzetgazdasági Minisztérium'),
(8, 'Bricklaying', 'ÉVOSZ'),
(9, 'Cabinetmaking', 'FESTOOL'),
(10, 'Joinery', 'FESTOOL'),
(11, 'Mechatronics', 'FESTO'),
(12, 'Painting and Decorating', 'Trilak'),
(13, 'Web Development', 'HTTP Alapítvány'),
(14, 'ICT Team', 'HTTP Alapítvány'),
(15, 'Hairdressing', 'Hajas Kft.'),
(16, 'Cooking', 'Gumdel Étterem'),
(17, 'Landscape Gardening', 'MAKEOSZ'),
(18, 'Plumbing and Heating', 'Szikra NG Kft.'),
(19, 'Health and Social Care', 'ÁEEK');

ALTER TABLE `sponsor`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `sponsor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
