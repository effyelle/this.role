<?php

namespace App\Controllers;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class Mailer
{
    protected mixed $mail;

    protected string $serviceHost = 'smtp.office365.com';
    protected string $fromEmail = 'this.role@outlook.com';
    protected string $fromName = 'This.Role';
    protected string $pwd = 'Aqws!123';
    protected string $SMTPsec = 'tls';
    protected int $port = 587;

    function __construct()
    {
        $this->mail = new PHPMailer(true);
        $this->mail->isSMTP();
        $this->mail->Host = $this->serviceHost;
        $this->mail->SMTPAuth = true;
        $this->mail->Username = $this->fromEmail;
        $this->mail->Password = $this->pwd;
        $this->mail->SMTPSecure = $this->SMTPsec;
        $this->mail->Port = $this->port;
        $this->mail->isHTML();
    }

    function send_mail_($subject, $message, $email): string|bool
    {
        try {
            $this->mail->Subject = $subject;
            $this->mail->Body = $message;
            $this->mail->setFrom($this->fromEmail, $this->fromName);
            $this->mail->addAddress($email);
            return $this->mail->send();

        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
}