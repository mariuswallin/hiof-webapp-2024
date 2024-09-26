type AvatarProps = {
	name: string;
};

const Avatar = ({ name }: AvatarProps) => {
	const avatar = name.split(" ").join("").toUpperCase().slice(0, 1);

	return <div className="avatar">{avatar}</div>;
};

export default Avatar;
