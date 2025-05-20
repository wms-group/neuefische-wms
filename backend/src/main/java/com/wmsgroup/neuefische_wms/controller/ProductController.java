package com.wmsgroup.neuefische_wms.controller;

import com.wmsgroup.neuefische_wms.model.dto.ProductInputDTO;
import com.wmsgroup.neuefische_wms.model.dto.ProductOutputDTO;
import com.wmsgroup.neuefische_wms.model.dto.ErrorDTO;
import com.wmsgroup.neuefische_wms.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public List<ProductOutputDTO> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/category/{categoryId}")
    public List<ProductOutputDTO> getProductsByCategoryId(@PathVariable String categoryId) {
        return productService.getProductsByCategoryId(categoryId);
    }

    @PostMapping
    public ResponseEntity<ProductOutputDTO> addProduct(@RequestBody ProductInputDTO productInputDTO) {
        return new ResponseEntity<>(
                productService.addProduct(productInputDTO),
                HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductOutputDTO> updateProduct(@PathVariable String id, @RequestBody ProductInputDTO productInputDTO) {
        return new ResponseEntity<>(
                productService.updateProduct(id, productInputDTO),
                HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorDTO> illegalArgumentExceptionHandler(IllegalArgumentException exception) {
        return new ResponseEntity<>(
                ErrorDTO.fromException(exception),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<ErrorDTO> nullPointerExceptionHandler(NullPointerException exception) {
        return new ResponseEntity<>(
                ErrorDTO.fromException(exception),
                HttpStatus.BAD_REQUEST);
    }
}
