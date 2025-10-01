<?php
declare(strict_types=1);

namespace App\Serializer;

use App\Entity\MovieShow;
use App\Repository\SeatRepository;
use ArrayObject;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class MovieShowAttributeNormalizer implements NormalizerInterface
{
    private const ALREADY_CALLED = 'MOVIE_SHOW_ATTRIBUTE_NORMALIZER_ALREADY_CALLED';

    public function __construct(
        #[Autowire(service: 'serializer.normalizer.object')]
        private readonly NormalizerInterface $normalizer,
        private readonly SeatRepository $seatRepository)
    {
    }

    /**
     * {@inheritdoc}
     */
    public function normalize($object, $format = null, array $context = []): array|ArrayObject
    {
        $context[self::ALREADY_CALLED] = true;

        $object->setAvailableSeats((int) $this->seatRepository->countAvailableSeatsForMovieShow($object->getId()));

        return $this->normalizer->normalize($object, $format, $context);
    }

    /**
     * {@inheritdoc}
     */
    public function supportsNormalization($data, $format = null, array $context = []): bool
    {
        if (isset($context[self::ALREADY_CALLED])) {
            return false;
        }

        return $data instanceof MovieShow;
    }

    /**
     * {@inheritdoc}
     *
     * @return bool[]
     */
    public function getSupportedTypes(?string $format): array
    {
        return [
            MovieShow::class => true, // Supports MyCustomClass and result is cacheable
        ];
    }
}
