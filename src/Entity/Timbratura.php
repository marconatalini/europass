<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\TimbraturaRepository")
 */
class Timbratura
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $codice;

    /**
     * @ORM\Column(type="datetime")
     */
    private $timestamp;

    /**
     * @ORM\Column(type="smallint")
     */
    private $direzione;

    /**
     * @ORM\Column(type="integer")
     */
    private $terminale;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCodice(): ?int
    {
        return $this->codice;
    }

    public function setCodice(int $codice): self
    {
        $this->codice = $codice;

        return $this;
    }

    public function getTimestamp(): ?\DateTimeInterface
    {
        return $this->timestamp;
    }

    public function setTimestamp(\DateTimeInterface $timestamp): self
    {
        $this->timestamp = $timestamp;

        return $this;
    }

    public function getDirezione(): ?int
    {
        return $this->direzione;
    }

    public function setDirezione(int $direzione): self
    {
        $this->direzione = $direzione;

        return $this;
    }

    public function getTerminale(): ?int
    {
        return $this->terminale;
    }

    public function setTerminale(int $terminale): self
    {
        $this->terminale = $terminale;

        return $this;
    }

}
