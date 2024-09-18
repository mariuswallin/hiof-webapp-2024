type AvatarProps = {
  avatar: string;
};

const Avatar = ({ avatar }: AvatarProps) => {
  return <div className="avatar">{avatar}</div>;
};

export default Avatar;
