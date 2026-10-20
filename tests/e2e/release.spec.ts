import { test, expect } from './fixtures';
test('health and security headers are present in the production server',async({request})=>{
 const response=await request.get('/api/health');expect(response.status()).toBe(200);expect(await response.json()).toEqual({status:'ok',ai:'disabled'});
 expect(response.headers()['cache-control']).toBe('no-store');expect(response.headers()['x-content-type-options']).toBe('nosniff');expect(response.headers()['content-security-policy']).toContain("frame-ancestors 'none'");
});
test('privacy disclosure is reachable from the footer',async({page})=>{
 await page.goto('/');await page.getByRole('contentinfo').getByRole('link',{name:'Privacy and local data'}).click();await expect(page).toHaveURL(/\/privacy$/);await expect(page.getByRole('heading',{name:'Privacy and local data',level:1})).toBeVisible();
});
