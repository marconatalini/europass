<?php

namespace App\Repository;

use App\Entity\Timbratura;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Timbratura|null find($id, $lockMode = null, $lockVersion = null)
 * @method Timbratura|null findOneBy(array $criteria, array $orderBy = null)
 * @method Timbratura[]    findAll()
 * @method Timbratura[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TimbraturaRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Timbratura::class);
    }

    /**
     * @return Timbratura[] array of timbrature
     */
    public function findTimbrature($data, $codice)
    {
        //$interval = new \DateInterval('P31D');

        return $this->createQueryBuilder('t')
            ->andWhere('t.timestamp like :fromDate')
            ->andWhere('t.codice = :codice')
            ->setParameter('fromDate', $data->format('Y-m-d').'%')
            ->setParameter('codice', $codice)
            ->orderBy('t.timestamp', 'ASC')
            ->getQuery()
            ->getResult()
            ;
    }

    // /**
    //  * @return Timbratura[] Returns an array of Timbratura objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('t.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Timbratura
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
