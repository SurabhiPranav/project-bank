-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: proma
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `adminlogin`
--

DROP TABLE IF EXISTS `adminlogin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adminlogin` (
  `username` varchar(20) DEFAULT NULL,
  `id` varchar(20) DEFAULT NULL,
  `phonenumber` varchar(10) DEFAULT NULL,
  `email` varchar(30) DEFAULT NULL,
  `password` varchar(20) DEFAULT NULL,
  `session_token` varchar(255) DEFAULT NULL,
  `pic` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adminlogin`
--

LOCK TABLES `adminlogin` WRITE;
/*!40000 ALTER TABLE `adminlogin` DISABLE KEYS */;
INSERT INTO `adminlogin` VALUES ('sonali agarwal','prosonali','7989324868','sonali@iiita.ac.in','123','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoicHJvc29uYWxpIiwiaWF0IjoxNjg0NTg4MjAzfQ.zZE5u5QWS8IYJZ4UeiNZ8f4TeaG0VFV_vspVXnqi8_M',NULL),('soumyadev maity','promaity','9989324868','promaity@iiita.ac.in','123',NULL,NULL),('s venkatesan','provenky','9789324868','venkat@iiita.ac.in','123',NULL,NULL);
/*!40000 ALTER TABLE `adminlogin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `fid` int DEFAULT NULL,
  `id` varchar(20) DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `mess` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (NULL,'IIT2021178',10,'good'),(NULL,'IIT2021178',8,'bad'),(NULL,'',9,'good'),(NULL,'',9,'good'),(NULL,'',1,'bad'),(NULL,'',4,'bad'),(NULL,'IIT2021178',10,'good'),(NULL,'IIT2021178',9,'good'),(NULL,'IIT2021178',10,'good');
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persons`
--

DROP TABLE IF EXISTS `persons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `persons` (
  `Personid` int NOT NULL AUTO_INCREMENT,
  `LastName` varchar(255) NOT NULL,
  `FirstName` varchar(255) DEFAULT NULL,
  `Age` int DEFAULT NULL,
  PRIMARY KEY (`Personid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persons`
--

LOCK TABLES `persons` WRITE;
/*!40000 ALTER TABLE `persons` DISABLE KEYS */;
INSERT INTO `persons` VALUES (1,'Monsen','Lars',NULL),(2,'Monn','Lar',NULL);
/*!40000 ALTER TABLE `persons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project` (
  `projectname` varchar(100) DEFAULT NULL,
  `id` varchar(20) DEFAULT NULL,
  `tag` varchar(100) DEFAULT NULL,
  `dis` varchar(1000) DEFAULT NULL,
  `pid` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`pid`),
  KEY `id` (`id`),
  CONSTRAINT `project_ibfk_1` FOREIGN KEY (`id`) REFERENCES `userlogin` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project`
--

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
INSERT INTO `project` VALUES ('attendance management system','IIT2021130','ML','it\'s attendance management system',3);
/*!40000 ALTER TABLE `project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userlogin`
--

DROP TABLE IF EXISTS `userlogin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userlogin` (
  `username` varchar(20) DEFAULT NULL,
  `id` varchar(20) NOT NULL,
  `phonenumber` varchar(10) DEFAULT NULL,
  `email` varchar(30) DEFAULT NULL,
  `password` varchar(20) DEFAULT NULL,
  `dept` varchar(20) DEFAULT NULL,
  `session_token` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `about` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `pic` varchar(255) DEFAULT NULL,
  `twitterlink` varchar(255) DEFAULT NULL,
  `linkedinlink` varchar(255) DEFAULT NULL,
  `githublink` varchar(255) DEFAULT NULL,
  `Facebooklink` varchar(255) DEFAULT NULL,
  `AdminID` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userlogin`
--

LOCK TABLES `userlogin` WRITE;
/*!40000 ALTER TABLE `userlogin` DISABLE KEYS */;
INSERT INTO `userlogin` VALUES ('venkatesh','IEC2021032','7032936040','iec2021032@iiita.ac.in','032','ECE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('preetham','IEC2021034','7032736040','iec2021034@iiita.ac.in','034','ECE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('Ratan','IIT2021016','1234567890','iit2021016@iiita.ac.in','123','IT',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('parvish','IIT2021130',NULL,'iit2021130@iiita.ac.in','130','IT',NULL,'','','vizag','/uploads/IIT2021130/IIT2021178.png','','',NULL,'',NULL),('king','IIT2021158','123456789','iit2021016@iiita.ac.in','123','ITB',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('saketh','IIT2021160','8328038423','iit2021160@iiita.ac.in','160','IT',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('pranav','IIT2021178',NULL,'iit2021178@iiita.ac.in','1234','IT',NULL,'uppal','I\'M pranav','hyderabad','/uploads/IIT2021178/IIT2021178.png','','','https://github.com/SurabhiPranav','',NULL),('rehammtullah','IIT2021187','9392565283','iit2021187@iiita.ac.in','187','IT',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('aditya ranjan','IIT2021194','9392565287','iit2021194@iiita.ac.in','194','IT',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `userlogin` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-20 18:48:24
