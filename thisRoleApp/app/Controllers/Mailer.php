<?php

namespace App\Controllers;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

/**
 * \App\Controllers\Mailer is a wrapper for \PHPMailer\PHPMailer\PHPMailer in the /vendor folder. That is, it manages
 * the settings of the class in charge of sending emails. Along with the \App\Controllers\SheetDnD, this controller
 * does not make direct calls to any models and does not return HTML views.
 */
class Mailer
{
    /**
     * Instance of PHPMailer
     *
     * @var mixed|PHPMailer
     */
    protected mixed $mail;

    /**
     * @var string
     */
    protected string $serviceHost = 'smtp.office365.com';

    /**
     * @var string
     */
    protected string $fromEmail = 'this.role@outlook.com';

    /**
     * @var string
     */
    protected string $fromName = 'This.Role';

    /**
     * @var string
     */
    protected string $pwd = 'Aqws!123';

    /**
     * @var string
     */
    protected string $SMTPsec = 'tls';

    /**
     * @var int
     */
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

    /**
     * ---
     * SEND EMAIL
     * ---
     * Parameters are required.
     *
     * Return {@link PHPMailer::send()} function response.
     *
     * Upon catching an Exception, return the error message.
     *
     * @param $subject
     * @param $message
     * @param $email
     *
     * @return string|bool
     */
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