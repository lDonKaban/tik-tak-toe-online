import { z } from "zod";
import { ru } from "zod/locales";

// Устанавливаем русскую локализацию ошибок zod глобально
z.config(ru());
