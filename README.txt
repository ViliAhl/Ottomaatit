Ottomaatit-hakija etsii lähimmän Ottomaatin käyttäjän sijainnin tai annetun osoitteen perusteella.

Toteutus on tehty Mysql-tietokannalla, javascriptillä ja php:llä. Sivu käyttää tiedostoja Test.html -> Script.js -> load.php.

Tietokannan rakenne:
+-------------------------+
| Tables_in_Ottomaatit_db |
+-------------------------+
| Comments                |
| Ottomaatit              |
+-------------------------+

Taulujen rakenne:

+-----------+--------------+------+-----+---------+-------+
| Field     | Type         | Null | Key | Default | Extra |
+-----------+--------------+------+-----+---------+-------+
| id        | int(11)      | NO   | PRI | NULL    |       |
| address   | varchar(45)  | NO   |     | NULL    |       |
| city      | varchar(15)  | NO   |     | NULL    |       |
| location  | varchar(45)  | NO   |     | NULL    |       |
| latitude  | decimal(8,6) | NO   |     | NULL    |       |
| longitude | decimal(8,6) | NO   |     | NULL    |       |
+-----------+--------------+------+-----+---------+-------+
+---------------+--------------+------+-----+---------+----------------+
| Field         | Type         | Null | Key | Default | Extra          |
+---------------+--------------+------+-----+---------+----------------+
| comment_id    | int(11)      | NO   | PRI | NULL    | auto_increment |
| ottomaatti_id | int(11)      | NO   | MUL | NULL    |                |
| name          | varchar(15)  | NO   |     | NULL    |                |
| comment       | varchar(100) | YES  |     | NULL    |                |
| timestamp     | date         | NO   |     | NULL    |                |
+---------------+--------------+------+-----+---------+----------------+

Data palautetaan tietokannasta muodossa:

{\"id\":\"3714\",\"address\":\"TORNIONKATU 17\",\"city\":\"KEMI\",\"location\":\"KARIHAARAN KIOSKI\",\"latitude\":\"65.759886\",\"longitude\":\"24.546653\"}","{\"id\":\"3715\",\"address\":\"KAIVOKATU 1\",\"city\":\"HELSINKI\",\"location\":\"RAUTATIEASEMA\",\"latitude\":\"60.171000\",\"longitude\":\"24.941670\"}

Kommenttien tallentamista ei ole toteutettu käyttöliittymälle asti, mutta load.php sisältää myös tallennuksen kommenteille ja Script.js ajax-kutsun tallennukselle.
