using System.Xml.Schema;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _storeContext;
        public BasketController(StoreContext storeContext)
        {
            _storeContext = storeContext;
            
        }

        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await RetrieveBasket(GetBuyerId());

            if (basket == null)
            {
                return NotFound();
            }

            return basket.MapBasketToDto();
        }        

        private async Task<Basket> RetrieveBasket(string buyerId)
        {
            if (string.IsNullOrEmpty(buyerId))
            {
                Response.Cookies.Delete("buyerId");
                return null;
            }
            return await _storeContext.Baskets
                .Include(i => i.Items)
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
        }

        private string GetBuyerId()
        {
            return User.Identity?.Name ?? Request.Cookies["buyerId"];
        }

        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {
            var basket = await RetrieveBasket(GetBuyerId());
            if (basket == null)
            {
                basket = CreateBasket();
            }

            var product = await _storeContext.Products.FindAsync(productId);
            if (product == null)
            {
                return BadRequest(new ProblemDetails{Title= "Product Not Found"});
            }
            basket.AddItem(product, quantity);
            var result = await _storeContext.SaveChangesAsync();
            if (result > 0)
            {
                return CreatedAtRoute("GetBasket", basket.MapBasketToDto());
            }

            return BadRequest(new ProblemDetails{Title="Problem saving item to basket"});
        }

        private Basket CreateBasket()
        {
            var buyerId = User.Identity?.Name;
            if (string.IsNullOrEmpty(buyerId))
            {
                buyerId = Guid.NewGuid().ToString();
                var cookieOptions = new CookieOptions{
                    IsEssential=true, 
                    Expires=DateTime.Now.AddDays(30)
                };
                Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            }
            
            var basket = new Basket{ BuyerId= buyerId };
            _storeContext.Add(basket);
            return basket;
        }


        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {
            var basket = await RetrieveBasket(GetBuyerId());

            if (basket == null)
            {
                return NotFound();
            }

            basket.RemoveItem(productId, quantity);

            var result = await _storeContext.SaveChangesAsync() >0;

            if (result)
            {
                return Ok();
            }
            return BadRequest(new ProblemDetails{ Title="Problem removing product from basket"});
        }
    }
}