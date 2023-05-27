<?php

namespace App\Controllers;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class Mailer
{
    protected mixed $mail;

    function __construct()
    {
        $this->mail = new PHPMailer(true);
        $this->mail->isSMTP();
        $this->mail->Host = 'smtp.office365.com';
        $this->mail->SMTPAuth = true;
        $this->mail->Username = 'this.role@outlook.com';
        $this->mail->Password = 'Aqws!123';
        $this->mail->SMTPSecure = 'tls';
        $this->mail->Port = 587;
    }

    function send_mail_($subject, $message, $email): string|bool
    {
        try {
            $this->mail->Subject = $subject;
            $this->mail->Body = $message;
            $this->mail->setFrom('this.role@outlook.com', 'This.Role');
            $this->mail->addAddress($email);
            return $this->mail->send();

        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
}