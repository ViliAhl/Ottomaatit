<?php
    
    echo loadOttomaatit();
    
    
    function loadOttomaatit() {
        $servername = getenv('IP');
        $username = getenv('C9_USER');
        $password = "";
        $database = "Ottomaatit_db";
        $dbport = 3306;
    
        $db = new mysqli($servername, $username, $password, $database, $dbport);
    
        // Check connection
        if ($db->connect_error) {
            die("Connection failed: " . $db->connect_error);
        } 
    
        $query = "SELECT * FROM Ottomaatit";
    
        $result = mysqli_query($db, $query);
        $ottomaatitArray = array();
    
        while($row = mysqli_fetch_assoc($result)) {
            $ottomaatitArray[] = json_encode($row);
        }
        
        mysqli_close($db);
        return json_encode($ottomaatitArray);

    }
    
    function loadComments() {
        $servername = getenv('IP');
        $username = getenv('C9_USER');
        $password = "";
        $database = "Ottomaatit_db";
        $dbport = 3306;
    
        $db = new mysqli($servername, $username, $password, $database, $dbport);
    
        // Check connection
        if ($db->connect_error) {
            die("Connection failed: " . $db->connect_error);
        } 
    
        $query = "SELECT * FROM Comments";
        
        $result = mysqli_query($db, $query);
        
        while($row = mysqli_fetch_assoc($result)) {
            $commentsArray[] = json_encode($row);
        }
        
        mysqli_close($db);
        
        return json_encode($commentsArray);
    }
    
    function insertComment($ottomaattiId, $name, $comment, $timestamp) {
        $servername = getenv('IP');
        $username = getenv('C9_USER');
        $password = "";
        $database = "Ottomaatit_db";
        $dbport = 3306;
    
        $db = new mysqli($servername, $username, $password, $database, $dbport);
    
        // Check connection
        if ($db->connect_error) {
            die("Connection failed: " . $db->connect_error);
        } 
    
        $query = "INSERT INTO Comments (ottomaatti_id, name, comment, timestamp) VALUES ($ottomaattiId, $name, $comment, $timestamp)";
        
        $result = mysqli_query($db, $query);
        mysqli_close($db);
    }

?>