import './Banner.css'

const Banner = (props) => {
    return (
        <div className="banner">
            <img src={props.img} alt={props.alt} />
        </div>
    )
}

export default Banner;
