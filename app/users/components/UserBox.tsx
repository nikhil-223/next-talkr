import { User } from "@prisma/client";

interface UserBoxProps {
	data: User;
}

const UserBox: React.FC<UserBoxProps> = ({ data }) => {
  return (
    <div>{data.name}</div>
  )
}

export default UserBox