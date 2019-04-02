<?php

namespace App\Controller;

use App\Entity\Timbratura;
use App\Repository\TimbraturaRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class TimbratureController
 * @package App\Controller
 */
class TimbratureController extends AbstractController
{
    /**
     * @Route("/", name="timbrature_index")
     */
    public function index(Request $request, TimbraturaRepository $timbraturaRepository)
    {
        $d = date_parse($request->get('data'));
        $codice = $request->get('codice');

        $timbrature = [];

        if (null !== $codice){
            for ($day = 1; $day<=31 ; $day++){
                $dateTimb = date_create($d['year'].'-'.$d['month'].'-'.$day);
                $record = $timbraturaRepository->findTimbrature($dateTimb,$codice);
                $timbrature[] = ['data' => $dateTimb, 'timb' => $record];
            }
        }

        return $this->render('timbrature/index.html.twig', [
            'timbrature' => $timbrature,
        ]);
    }

    /**
     * @Route("/online", methods={"GET"}, name="timbrature_saveOnline")
     * @return Response
     */
    public function saveOnline(Request $request) : Response
    {
        //00  CCCCCCC DD/MM/YY hhmm V
        $badge = $request->get('badge');
        $code = substr($badge, 6, 5);
        $timestamp = substr($badge, 12, 13);
        $direzione = substr($badge, -1);

        /*
        var_dump($code);
        var_dump($timestamp);
        var_dump($direzione);
        var_dump(date_create_from_format('d/m/y Hi',$timestamp));
        var_dump($request);
        die();*/


        $pass = new Timbratura();

        $em = $this->getDoctrine()->getManager();

        $pass->setCodice($code);
        $pass->setTimestamp(date_create_from_format('d/m/y Hi',$timestamp));
        $pass->setDirezione($direzione);

        $em->persist($pass);
        $em->flush();

        // the headers public attribute is a ResponseHeaderBag
        $response = new Response();
        $response->headers->set('Content-Type', 'text/plain');

        return $this->render('timbrature/online.html.twig', [
            'code' => $code,
            'direzione' => $direzione,
        ], $response);

    }

    /**
     * @Route("/batch", methods={"GET"}, name="timbrature_saveBatch")
     * @return Response
     */
    public function saveBatch(Request $request) : Response
    {
        //00  CCCCCCC DD/MM/YY hhmm V
        $badge = $request->get('badge');
        $code = substr($badge, 6, 5);
        $timestamp = substr($badge, 12, 13);
        $direzione = substr($badge, -1);

        $pass = new Timbratura();

        $em = $this->getDoctrine()->getManager();

        $pass->setCodice($code);
        $pass->setTimestamp(date_create_from_format('d/m/y Hi',$timestamp));
        $pass->setDirezione($direzione);

        $em->persist($pass);
        $em->flush();

        $response = new Response();
        $response->setContent('ack=1');
        $response->headers->set('Content-Type', 'text/plain');

        return $response;
    }

    /**
     * @Route("/keepalive", methods={"GET"}, name="timbrature_keepAlive")
     * @return Response
     */
    public function keepAlive() : Response
    {
        $response = new Response();
        $response->setContent('ack=1');
        $response->headers->set('Content-Type', 'text/plain');

        return $response;
    }
}
