const StarIcon = ({color = 'primary'}:{color: string}) => (
    <svg
        className={`text-${color}`}
        xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon
            stroke="currentColor"
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
)

export default StarIcon;