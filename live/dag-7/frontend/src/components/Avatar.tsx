type AvatarProps = {
	name: string;
};

export default function Avatar(data: AvatarProps) {
	const { name } = data;
	const firstLetter = name.split(" ").join("").toUpperCase().slice(0, 1);

	return <p className="avatar">{firstLetter}</p>;
}
