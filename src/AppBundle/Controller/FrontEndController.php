<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Category;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class FrontEndController extends Controller
{
    /**
     * @Route("/", name="home")
     * @Route("/categories", name="frontend_category_index")
     * @Method("GET")
     */
    public function indexAction()
    {
        $categories = $this->getDoctrine()
            ->getRepository('AppBundle:Category')
            ->findAll();

        return $this->render('frontend/category/index.html.twig', [
            'categories' => $categories,
        ]);
    }

    /**
     * @Route("/categories/{slug}", name="frontend_category_show")
     * @Method("GET")
     */
    public function showAction(Category $category)
    {
        $categories = $this->getDoctrine()
            ->getRepository('AppBundle:Category')
            ->findAll();

        return $this->render('frontend/category/show.html.twig', [
            'categories' => $categories,
            'current_category' => $category,
        ]);
    }
}
