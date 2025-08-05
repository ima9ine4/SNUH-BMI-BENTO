import { PUBLIC_BASE_API_URL } from '$env/static/public';

// ===== 코호트 이름 중복 확인 =====
export async function checkCohortNameDuplicate(cohortName) {
  const params = new URLSearchParams({ name: cohortName });
  const response = await fetch(`${PUBLIC_BASE_API_URL}/cohorts/check-name?${params}`);
  
  return response.json();
}
