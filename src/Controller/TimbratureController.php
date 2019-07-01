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
        return $this->render('timbrature/index.html.twig', [
        ]);
    }

    /**
     * @Route("/cartellino", name="timbrature_visualizza")
     */
    public function visualizza(Request $request){

        $codice = $request->get('codice');

        return $this->render('timbrature/timbrature.html.twig', [
            'codice' => $codice,
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

    /**
     * @Route("/timbratureJson", name="timbrature_JSON")
     */
    public function timbratureJSON(Request $request, TimbraturaRepository $repository){
        $codice = $request->get('codice');
        $start = $request->get('start');
        $end = $request->get('end');
        $result = $repository->findTimbrature($start, $end, $codice);
        foreach ($result as $key => $val){
            $title = $result[$key]['title'];
            if ($title == 0){
                $result[$key]['title'] = 'ENTRATA';
                $result[$key]['textColor'] = 'green';
            } else {
                $result[$key]['title'] = 'USCITA';
                $result[$key]['textColor'] = 'red';
            }
        }
        return $this->json($result);
    }
}
