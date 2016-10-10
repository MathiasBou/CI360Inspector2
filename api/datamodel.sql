-- phpMyAdmin SQL Dump
-- version 4.2.7.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Erstellungszeit: 10. Okt 2015 um 17:00
-- Server Version: 5.6.20-log
-- PHP-Version: 5.5.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Datenbank: `ci360_inspector`
--
CREATE USER 'ci360_inspector'@'localhost' IDENTIFIED BY 'CXfmZqwVzDpfzTKJ';
GRANT USAGE ON *.* TO 'ci360_inspector'@'localhost' IDENTIFIED BY 'CXfmZqwVzDpfzTKJ' WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;
CREATE DATABASE IF NOT EXISTS `ci360_inspector`;
GRANT ALL PRIVILEGES ON `ci360_inspector`.* TO 'ci360_inspector'@'localhost';

USE `ci360_inspector`;


--
-- Tabellenstruktur für Tabelle `demo_config`
--

DROP TABLE IF EXISTS `demo_config`;
CREATE TABLE IF NOT EXISTS `demo_config` (
`id` int(11) NOT NULL,
  `token` varchar(64) NOT NULL,
  `config_name` varchar(32) NOT NULL,
  `config_desc` text NOT NULL,
  `read_only` int(11) DEFAULT NULL,
  `config_json` text NOT NULL,
  `create_dttm` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modify_dttm` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `modify_by` varchar(64) NOT NULL,
  `email_to` varchar(64) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=32 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `demo_events`
--

DROP TABLE IF EXISTS `demo_events`;
CREATE TABLE IF NOT EXISTS `demo_events` (
`id` int(11) NOT NULL,
  `session` varchar(32) NOT NULL,
  `event_dttm` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `event_type` varchar(32) NOT NULL,
  `user_ip` varchar(32) NOT NULL,
  `user_system` varchar(1024) NOT NULL,
  `user_scenario` text NOT NULL,
  `detail1` varchar(1024) NOT NULL,
  `detail2` varchar(1024) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Indexes for dumped tables
--

--
-- Indexes for table `demo_config`
--
ALTER TABLE `demo_config`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `token` (`token`);

--
-- Indexes for table `demo_events`
--
ALTER TABLE `demo_events`
 ADD PRIMARY KEY (`id`);


--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `demo_config`
--
ALTER TABLE `demo_config`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `demo_events`
--
ALTER TABLE `demo_events`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
