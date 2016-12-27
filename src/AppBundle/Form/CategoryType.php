<?php

namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\CallbackTransformer;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CategoryType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('name');
        $builder->add('tags', TextType::class);

        $builder->get('tags')
            ->addModelTransformer(new CallbackTransformer(
                function (array $tagsAsArray) {
                    return implode(', ', $tagsAsArray);
                },
                function ($tagsAsString) {
                    $array = array_filter(array_map('trim', explode(',', $tagsAsString)));
                    sort($array);

                    return array_values($array);
                }
            ));
    }
    
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'AppBundle\Entity\Category'
        ));
    }
}
