<?php

namespace App\Controller;

use App\Entity\Timbratura;
use App\Repository\TimbraturaRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mercure\Publisher;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class TimbratureController
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

        if (null !== $codice) {
            return $this->render('timbrature/index.html.twig', [
            ]);
        }

        return $this->render('timbrature/timbrature.html.twig', [
            'codice' => $codice,
        ]);
    }

    /**
     * @Route("/live/{terminale<\d+>}", name="timbrature_live")
     */
    public function live($terminale){

        return $this->render('timbrature/live.html.twig',[
            'terminale' => $terminale
        ]);
    }

    /**
     * @Route("/online", methods={"GET"}, name="timbrature_saveOnline")
     */
    public function saveOnline(Request $request, Publisher $publisher) : Response
    {
        //00  CCCCCCC DD/MM/YY hhmm V
        $badge = $request->get('badge');
        $terminalId = $request->get('id');
        $code = substr($badge, 6, 5);
        $timestamp = substr($badge, 12, 13);
        $direzione = substr($badge, -1);

        $pass = new Timbratura();

        $em = $this->getDoctrine()->getManager();

        $pass->setCodice($code);
        $pass->setTimestamp(date_create_from_format('d/m/y Hi',$timestamp));
        $pass->setDirezione($direzione);
        $pass->setTerminale($terminalId);

        $em->persist($pass);
        $em->flush();

        $update = new Update('http://europass.locale/online/' . $pass->getTerminale(),
            json_encode([
                'codice' => $pass->getCodice(),
                'time' =>$pass->getTimestamp(),
                'terminale' => $pass->getTerminale(),
                'direzione' => $pass->getDirezione(),
            ]));

        try {
            $publisher($update);
        } catch (\Exception $e) {
        }

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
