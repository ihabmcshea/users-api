import { useState, useEffect } from "react";
import axios from "axios";
import { IUser } from "app/interfaces/IUser";

export const useUsers = (page: number, pageSize: number) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `next-api/users`,
          {
            params: { page, pageSize },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUsers(response.data.data.users);
        setTotalPages(response.data.data.totalPages);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [page, pageSize]);

  return { users, totalPages, isLoading };
};
